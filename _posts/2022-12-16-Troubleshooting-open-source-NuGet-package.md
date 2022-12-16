---
layout: [post, post-xml]                            # Pflichtfeld. Nicht ändern!
title: "Troubleshooting open source NuGet package"  # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2022-12-16 12:00                              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-12-16 12:00                     # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [vscherb]                               # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                   # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [NuGet]                                       # Bitte auf Großschreibung achten.
---

For a project I decided to use the [libgit2](https://github.com/libgit2/libgit2sharp) library which, fortunately, has a port to C#.
When adding the NuGet package in the latest version `0.26.2` (release December 11, 2019) the program ran into a problem at runtime as the shared library cannot be loaded.

Let's explore the steps to find more about that error and the resulting actions to resolve that problem and continue on with the project.

First I will create a MVP to replicate the problem and explore further without the other dependencies of the project.
Then follow my process of resolving the problem and find a solution.

This happens on the machine with [Majaro x64](https://manjaro.org/) with [.Net 6](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6).

# Replicate the error on a MVP

So far my observation was that every call to the library caused a problem.
Therefore a minimal reproduction of that problem would be achieved by including the NuGet and calling anything from the library.

``` csharp
// Get the directory where the executable is run.
string currentDirectory = Directory.GetCurrentDirectory();
// Call the library to check whether the provided location is a valid
// git repository.
bool directoryIsARepository = LibGit2Sharp.Repository.IsValid(currentDirectory);

// Set the exit code to non zero to indicate an error or the uncaught
// exception will print the details.
return directoryIsARepository ? 0 : 1;
```
_Fig1: Simplified version of [Program.cs](https://git.sr.ht/~vince/poc_libgit2sharp/tree/main/item/poc_libgit2sharp/Program.cs)_

So after recreating the error on my machine I created a new repository and added the least required code to reproduce the error.
The repository is uploaded at [sr.ht](https://git.sr.ht/~vince/poc_libgit2sharp).

``` csharp
$ git log --oneline -n1
e8f4902 Add simple check for the library

~/Projects/poc_libgit2sharp main $ make run
dotnet build ./poc_libgit2sharp/poc_libgit2sharp.csproj
Microsoft (R) Build Engine version 17.0.0+c9eb9dd64 for .NET
Copyright (C) Microsoft Corporation. All rights reserved.

  Determining projects to restore...
  All projects are up-to-date for restore.
  poc_libgit2sharp -> /home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/poc_libgit2sharp.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:01.33
dotnet run --project ./poc_libgit2sharp/poc_libgit2sharp.csproj
Current directory is '/home/vince/Projects/poc_libgit2sharp'
Checking whether the directory contains a valid git repository.
Should return true as the program is run from a repository.
Unhandled exception. System.TypeInitializationException: The type initializer for 'LibGit2Sharp.Core.NativeMethods' threw an exception.
---> System.DllNotFoundException: Unable to load shared library 'git2-106a5f2' or one of its dependencies. In order to help diagnose loading problems, consider setting the LD_DEBUG environment variable: libgit2-106a5f2: cannot open shared object file: No such file or directory
at LibGit2Sharp.Core.NativeMethods.git_libgit2_init()
at LibGit2Sharp.Core.NativeMethods.InitializeNativeLibrary()
at LibGit2Sharp.Core.NativeMethods..cctor()
--- End of inner exception stack trace ---
at LibGit2Sharp.Core.NativeMethods.git_repository_open_ext(git_repository*& repository, FilePath path, RepositoryOpenFlags flags, FilePath ceilingDirs)
at LibGit2Sharp.Core.Proxy.git_repository_open_ext(String path, RepositoryOpenFlags flags, String ceilingDirs)
at LibGit2Sharp.Repository.IsValid(String path)
at Program.<Main>$(String[] args) in /home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/Program.cs:line 7
make: *** [Makefile:18: run] Error 134
```
_Fig2: Recreating the error on the MVP_

Now let us dissect the thrown error message a bit further to understand the underlying problem before taking further actions or dive deep into the code of the open source repository [libgit2](https://github.com/libgit2/libgit2sharp).

``` csharp
Unhandled exception. System.TypeInitializationException:
	The type initializer for 'LibGit2Sharp.Core.NativeMethods' threw an exception.
---> System.DllNotFoundException:
	Unable to load shared library 'git2-106a5f2' or one of its dependencies.
	In order to help diagnose loading problems, consider setting the LD_DEBUG environment variable:
	libgit2-106a5f2: cannot open shared object file: No such file or directory
```
_Fig3: Information from the exception_

We know that the library is a wrapper around the C implementation of libgit2 to enjoy it in the managed world of dotnet.
Armed with this knowledge we can suspect that the reference to `git2-106a5f2` of the `System.DllNotFoundException` is about the native library.
The next step is to find out where the library gets loaded from and where the error occurs to get a better understanding of the problem.
