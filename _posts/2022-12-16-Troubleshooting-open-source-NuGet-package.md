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

# Exploration with Debug options

The error message gives us all the information we need to proceed further as it indicated about the usage of `LD_DEBUG`.
So lets explore the output with that environment variable set (output is greatly condensed).

``` csharp
~/Projects/poc_libgit2sharp main $ LD_DEBUG=libs make run
dotnet run --project ./poc_libgit2sharp/poc_libgit2sharp.csproj
   1022222:	initialize program: /home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/poc_libgit2sharp
Current directory is '/home/vince/Projects/poc_libgit2sharp'
Checking whether the directory contains a valid git repository.
Should return true as the program is run from a repository.
   1022222:	find library=git2-106a5f2.so [0]; searching
   1022222:	 search cache=/etc/ld.so.cache
   1022222:	 search path=/usr/lib/tls:/usr/lib		(system search path)
   1022222:	  trying file=/usr/lib/tls/git2-106a5f2.so
   1022222:	  trying file=/usr/lib/git2-106a5f2.so
   1022222:
   1022222:	[...]
   1022222:	find library=libgit2-106a5f2.so [0]; searching
   1022222:	 search cache=/etc/ld.so.cache
   1022222:	 search path=/usr/lib/tls:/usr/lib		(system search path)
   1022222:	  trying file=/usr/lib/tls/libgit2-106a5f2.so
   1022222:	  trying file=/usr/lib/libgit2-106a5f2.so
   1022222:
   1022222:	[...]
   1022222:	find library=git2-106a5f2 [0]; searching
   1022222:	 search cache=/etc/ld.so.cache
   1022222:	 search path=/usr/lib/tls:/usr/lib		(system search path)
   1022222:	  trying file=/usr/lib/tls/git2-106a5f2
   1022222:	  trying file=/usr/lib/git2-106a5f2
   1022222:
   1022222:	find library=libgit2-106a5f2 [0]; searching
   1022222:	 search cache=/etc/ld.so.cache
   1022222:	 search path=/usr/lib/tls:/usr/lib		(system search path)
   1022222:	  trying file=/usr/lib/tls/libgit2-106a5f2
   1022222:	  trying file=/usr/lib/libgit2-106a5f2
   1022222:
Unhandled exception.
System.TypeInitializationException: The type initializer for 'LibGit2Sharp.Core.NativeMethods' threw an exception.
 ---> System.DllNotFoundException: Unable to load shared library 'git2-106a5f2' or one of its dependencies.
      [...]
make: *** [Makefile:18: run] Error 134
```
_Fig4: LD_DEBUG run to list the libraries_

When running the `LD_DEBUG` with `all` or `files` we get similar results.

``` csharp
   1022654:	file=/home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/runtimes/linux-x64/native/git2-106a5f2.so [0];  dynamically loaded by /usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/libcoreclr.so [0]
   1022654:
   1022654:	file=/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/git2-106a5f2.so [0];  dynamically loaded by /usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/libcoreclr.so [0]
   1022654:
   1022654:	file=/home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/git2-106a5f2.so [0];  dynamically loaded by /usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/libcoreclr.so [0]
   1022654:
   1022654:	file=git2-106a5f2.so [0];  dynamically loaded by /usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/libcoreclr.so [0]
   [...]
   1022654:	file=/home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/runtimes/linux-x64/native/libgit2-106a5f2.so [0];  dynamically loaded by /usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/libcoreclr.so [0]
   1022654:	file=/home/vince/Projects/poc_libgit2sharp/poc_libgit2sharp/bin/Debug/net6.0/runtimes/linux-x64/native/libgit2-106a5f2.so [0];  generating link map
   1022654:	  dynamic: 0x00007fda6ad24d90  base: 0x00007fda6aa00000   size: 0x000000000032a5d0
   1022654:	    entry: 0x00007fda6aa166f0  phdr: 0x00007fda6aa00040  phnum:                  7
```
_Fig5: Output from `LD_DEBUG=files`_

The library files `./bin/Debug/net6.0/runtimes/linux-x64/native/libgit2-106a5f2.so` does exist and can be imported correctly.
On the other hand the referenced file `/usr/share/dotnet/shared/Microsoft.NETCore.App/6.0.2/git2-106a5f2.so` does not exist at this global location.

If there would be no specific version applied to the shared object file I would say the file should come from the system.
Let's check the package manager and install the latest version of the underlying library `libgit2` on the system.

``` bash
$ sudo pacman -S libgit2
```
_Fig6: Installing the package globally [packages libgit2](https://archlinux.org/packages/extra/x86_64/libgit2/)_

Even after the installation/update the error persists.
So as expected there is no correlation with the global installation of the library and it should come all bundled with the NuGet.

Going further and exploring the issues on GitHub and discovering a potential fix will be the next step.
