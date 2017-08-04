(function(window, $) {

	if(typeof window.adesso === "undefined") {
		window.adesso = {};
	}

	window.adesso.socialSharing =
	{
		API:
		{
			apiURL: "",
			apiRequest: function(callback, resource, params, method) {
				params.resource = resource;
				params.method = method;
				var ret = null;
				$.ajax({
					url: this.apiURL,
					data: params,
					method: "post",
					dataType: "json",
					success: function (data)
					{
						if (callback)
						{
							callback(data);
						}
					},
					error: function(jqXHR, textStatus, errorThrown)
					{
						if (callback)
						{
							callback(jqXHR);
						}
					}
				});
			},
			createCollection: function(callback) {
				this.apiRequest(callback, "collection", {}, "post");
			},
			copyCollection: function(callback, key) {
				this.apiRequest(callback, "collection", {key: key}, "copy");
			},
			deleteCollection: function(callback, key) {
				this.apiRequest(callback, "collection", {key: key}, "delete");
			},
			addPage: function(callback, key, url, title, description, picture_474x474, picture_948x948, picture_750x500, picture_1500x1000, color) {
				this.apiRequest(callback, "collectionItem", {
					key: key,
					url: url,
					title: title,
					description: description,
					picture_474x474: picture_474x474,
					picture_948x948: picture_948x948,
					picture_750x500: picture_750x500,
					picture_1500x1000: picture_1500x1000,
					color: color
				}, "post");
			},
			deletePage: function(callback, key, id) {
				this.apiRequest(callback, "collectionItem", {key: key, id: id}, "delete");
			},
			getCollection: function(callback, key) {
				this.apiRequest(callback, "collection", {key: key}, "get");
			}
		},
		localStorage:
		{
			get: function(key)
			{
				return localStorage[key];
			},
			set: function(key, value)
			{
				if (value == null)
				{
					localStorage.removeItem(key);
				}
				else
				{
					localStorage[key] = value;
				}
			}
		},
		sessionStorage:
		{
			get: function(key)
			{
				return sessionStorage[key];
			},
			set: function(key, value)
			{
				if (value == null)
				{
					sessionStorage.removeItem(key);
				}
				else
				{
					sessionStorage[key] = value;
				}
			}
		},
	
		urlParameters:
		{
			get: function(name)
			{
				var ret = null;
				var urlParameters = window.location.search.substring(1);
				var parameters = urlParameters.split("&");
				for (i = 0; i < parameters.length && ret == null; i++)
				{
					var parameterNameAndValue = parameters[i].split("=");
					if (parameterNameAndValue.length > 1 && parameterNameAndValue[0] === name)
					{
						if (parameterNameAndValue[1])
						{
							ret = decodeURIComponent(parameterNameAndValue[1]);
						}
					}
				}
				return ret;
			}
		},
	
		global:
		{
			cookie_name: "adesso-saved-pages",
			adesso_modul_fixed_pos_wrap_selector: ".adesso-modul-fixed-pos-wrap",
			adesso_save_a_page_btn_selector: ".adesso-modul-fixed-pos-wrap #adesso-save-a-page-btn",
			handleError: function(response)
			{
				var ret = false;
				if (response == null || response.status != 200)
				{
					ret = true;
					if (console)
					{
						var statusCode = "";
						if (response)
						{
							statusCode = response.status;
						}
						console.log("Error social sharing:" + statusCode);
					}
				}
				return ret;
			},
			updateMenuCount: function ()
			{
				// Anzahl der gespeicherten Seiten auslesen.
				var savedPagesCount = this.getSavedPagesItems().length;
				
				if (savedPagesCount > 0)
				{
					$("#adesso-topnav #besucht .badge").html(savedPagesCount);
					$("#adesso-topnav #besucht .badge").show();
				}
				else
				{
					$("#adesso-topnav #besucht .badge").hide();
				}
			},
			setSavedPagesItems: function (items)
			{
				if (items)
				{
					adesso.socialSharing.localStorage.set("adesso-saved-pages-items", JSON.stringify(items));
				}
				else
				{
					adesso.socialSharing.localStorage.set("adesso-saved-pages-items", items);
				}
			},
			getSavedPagesItems: function ()
			{
				var ret = null;
				var savedPagesItems = adesso.socialSharing.localStorage.get("adesso-saved-pages-items");
				if (savedPagesItems)
				{
					try
					{
						ret = JSON.parse(savedPagesItems);
					}
					catch(err)
					{
						ret = [];
						if (console)
						{
							console.log("Error parsing json for adesso-saved-pages-items:" + err.message);
						}
					}
				}
				else
				{
					ret = [];
				}
				return ret;
			},
			getSavedPageItemPosByURL: function (url)
			{
				var pos = -1;
				var savedPagesItems = this.getSavedPagesItems();
				for (i = 0; i < savedPagesItems.length && pos == -1; i++)
				{
					if (savedPagesItems[i].url == url)
					{
						pos = i;
					}
				}
				
				return pos;
			},
			getSavedPageItemPosByID: function (id)
			{
				var pos = -1;
				var savedPagesItems = this.getSavedPagesItems();
				for (i = 0; i < savedPagesItems.length && pos == -1; i++)
				{
					if (savedPagesItems[i].id == id)
					{
						pos = i;
					}
				}
				
				return pos;
			},
			addSavedPageItem: function (item)
			{
				// Noch nicht vorhanden?
				if (this.getSavedPageItemPosByURL(item.url) == -1)
				{
					var savedPagesItems = this.getSavedPagesItems();
					savedPagesItems.push(item);
					this.setSavedPagesItems(savedPagesItems);
				}
			},
			removeSavedPageItemByURL: function (url)
			{
				var pos = this.getSavedPageItemPosByURL(url);
				// Überhaupt vorhanden?
				if (pos != -1)
				{
					var savedPagesItems = this.getSavedPagesItems();
					savedPagesItems.splice(pos, 1 );
					this.setSavedPagesItems(savedPagesItems);
				}
			},
			removeSavedPageItemByID: function (id)
			{
				var pos = this.getSavedPageItemPosByID(id);
				// Überhaupt vorhanden?
				if (pos != -1)
				{
					var savedPagesItems = this.getSavedPagesItems();
					savedPagesItems.splice(pos, 1 );
					this.setSavedPagesItems(savedPagesItems);
				}
			},
			setInitDone: function(value)
			{
				// In der Session setzten.
				adesso.socialSharing.sessionStorage.set("adesso-saved-pages-init-done", value);
			},
			getInitDone: function()
			{
				// Aus der Session lesen.
				return adesso.socialSharing.sessionStorage.get("adesso-saved-pages-init-done");
			},
			setKey: function(key)
			{
				adesso.socialSharing.localStorage.set("adesso-saved-pages-key", key);
			},
			getKey: function()
			{
				return adesso.socialSharing.localStorage.get("adesso-saved-pages-key");
			},
			setParameterKey: function(parameterKey)
			{
				// In der Session setzten.
				adesso.socialSharing.sessionStorage.set("adesso-saved-pages-parameter-key", parameterKey);
			},
			parameterKeyIsEqual: function(parameterKey)
			{
				var ret = false;
				
				// Aus der Session lesen.
				var parameterKeyFromSession = adesso.socialSharing.sessionStorage.get("adesso-saved-pages-parameter-key");
				if (parameterKeyFromSession)
				{
					if (parameterKeyFromSession == parameterKey)
					{
						ret = true;
					}
				}
				
				return ret;
			},
			checkSharedKey: function (doneCallback)
			{
				var t = this;
				
				// Wurde ein Key übergeben von einer geteilten Collection?
				var parameterKey = adesso.socialSharing.urlParameters.get("k");
				if (parameterKey)
				{
					// Prüfen ob der übergebene Key noch nicht verarbeitet wurde.
					// Damit dieses nur einmalig pro Key ausgeführt wird.
					if (this.parameterKeyIsEqual(parameterKey) == false)
					{
						// Collection anhandy Key in eine neue kopieren, damit
						// der Benutzer eine eigene erhält und diese bearbeiten kann ohne die gesamte zubearbeiten.
						var callback = function(response)
						{
							if (t.handleError(response) == false)
							{
								if (response.collection && response.collection.key)
								{
									var key = response.collection.key;
									
									// Durch das setzten im Cookie und Storage, wird sein alter Key verworfen.
									
									// Im Cookie setzten.
									$.cookie(t.cookie_name, key, { expires: 30, path: "/" });
									
									// Key setzten.
									t.setKey(key);
									
									// Initialisierung zurücksetzten, damit das neuladen durchgeführt wird.
									t.setInitDone(null);
								}
							}
							
							// Key in der Session setzten, da dieser verarbeitet wurde.
							t.setParameterKey(parameterKey);
							
							// Callback aufrufen wenn fertig.
							if (doneCallback)
							{
								doneCallback();
							}
						};
					
						// API Call.
						adesso.socialSharing.API.copyCollection(callback, parameterKey);
					}
					else
					{
						// Callback aufrufen wenn fertig.
						if (doneCallback)
						{
							doneCallback();
						}
					}
				}
				else
				{
					// Callback aufrufen wenn fertig.
					if (doneCallback)
					{
						doneCallback();
					}
				}
			},
			getSavePageURL: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-url");
			},
			getSavePageTitle: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-title");
			},
			getSavePageDescription: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-description");
			},
			getSavePagePicture474x474: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-picture_474x474");
			},
			getSavePagePicture948x948: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-picture_948x948");
			},
			getSavePagePicture750x500: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-picture_750x500");
			},
			getSavePagePicture1500x1000: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-picture_1500x1000");
			},
			getSavePageColor: function ()
			{
				return $(this.adesso_save_a_page_btn_selector).attr("data-color");
			},
			initSavedPageState: function ()
			{
				// URL vorhanden?
				if (this.getSavedPageItemPosByURL(this.getSavePageURL()) != -1)
				{
					// URL enthalten.
					
					// Icon Status setzten.
					this.setPageSavedIconState(true);
				}
				else
				{
					// URL nicht enthalten.
					
					// Icon Status setzten.
					this.setPageSavedIconState(false);
				}
				
				// Mouseleave event werfen, damit die CSS Classen korrekt gesetzt werden.
				$(this.adesso_save_a_page_btn_selector).mouseleave();
			},
			fillSocialShareLinks: function()
			{
				// Seiten URL.
				var pageURL = window.location;
				var pageURLEncoded = encodeURI(pageURL);
				
				// Sharing Links befüllen mit der URL.
				$(this.adesso_modul_fixed_pos_wrap_selector + " .adesso-social-share-link").each(function()
				{
					var hrefValue = $(this).attr("href");
					hrefValue = hrefValue.replace("###url###", pageURLEncoded);
					$(this).attr("href", hrefValue)
				});
				
				// E-Mail Mailto anpassen.
				var mailtoElement = $(this.adesso_modul_fixed_pos_wrap_selector + " .adesso-social-share-email");
				if (mailtoElement.length > 0)
				{
					var mailtoHrefValue = mailtoElement.attr("href");
					var mailtoAppendChar = "?"
					if (mailtoHrefValue.indexOf("mailto:?") == 0)
					{
						mailtoAppendChar = "&";
					}
					mailtoElement.attr("href", mailtoHrefValue + mailtoAppendChar + "body=" + pageURLEncoded);
				}
			},
			init: function (doneCallback)
			{
				var t = this;
				
				// Events einhängen.
				this.addEvents();
				
				// Social Sharing Links befüllen.
				this.fillSocialShareLinks();
				
				// Wurde die Initialisierung bereits durchgeführt?
				if (this.getInitDone())
				{
					// Menü Anzeige aktualisieren.
					this.updateMenuCount();
					
					// Seiten gespeicherten Status init.
					this.initSavedPageState();
					
					// Callback aufrufen wenn init fertig.
					if (doneCallback)
					{
						doneCallback();
					}
				}
				else
				{
					// Key aus dem Cookie lesen.
					var cookieKeyValue = $.cookie(this.cookie_name);
					
					// Cookie Wert vorhanden?
					if (cookieKeyValue)
					{
						// Anzahl von gespeicherten Seiten und URLs auslesen.
						var callback = function(response)
						{
							// Alle zuvor Items der gespeicherten Seiten löschen.
							t.setSavedPagesItems(null);
							
							if (t.handleError(response) == false)
							{
								// Bei Erfolg, Key im Storage ablegen.
								t.setKey(cookieKeyValue);
								
								if (response.collection && response.collection.items)
								{
									// Items der gespeicherten Seiten merken.
									var savedPagesURLs = [];
									$.each(response.collection.items, function(index, item)
									{
										t.addSavedPageItem(item);
									});
								}
							}
							else
							{
								// Bei Fehler Key entfernen.
								t.setKey(null);
							}
							
							// Initialisierung durchgeführt setzten.
							t.setInitDone(true);
							
							// Menü Anzeige aktualisieren.
							t.updateMenuCount();
							
							// Seiten gespeicherten Status init.
							t.initSavedPageState();
							
							// Callback aufrufen wenn init fertig.
							if (doneCallback)
							{
								doneCallback();
							}
						};
					
						// API Call.
						adesso.socialSharing.API.getCollection(callback, cookieKeyValue);
					}
					else
					{
						// Callback aufrufen wenn init fertig.
						if (doneCallback)
						{
							doneCallback();
						}
					}
				}
			},
			getOrCreateKeyWithCookie: function(doneCallback)
			{
				var t = this;
				
				// Key auslesen.
				var key = this.getKey();
				
				// Ist ein Key bereits vorhanden?
				if (key)
				{
					// Callback aufrufen wenn fertig.
					if (doneCallback)
					{
						doneCallback(key);
					}
				}
				else
				{
					// Neuen anlegen und im Coookie und im Storage setzten.
					var callback = function(response)
					{
						if (t.handleError(response) == false)
						{
							if (response.collection && response.collection.key)
							{
								key = response.collection.key;
								
								// Im Cookie setzten.
								$.cookie(t.cookie_name, key, { expires: 30, path: "/" });
								
								// Key setzten.
								t.setKey(key);
							}
							else
							{
								// Bei Fehler Key entfernen.
								t.setKey(null);
							}
						}
						
						// Alle zuvor Items der gespeicherten Seiten löschen.
						t.setSavedPagesItems(null);
						
						// Callback aufrufen wenn fertig.
						if (doneCallback)
						{
							doneCallback(key);
						}
					};
					
					// API Call.
					adesso.socialSharing.API.createCollection(callback);
				}
			},
			deletePage: function(doneCallback, url)
			{
				var t = this;
				
				var keyDoneCallback = function(key)
				{
					// ID der Seite anhand der URL ermitteln.
					var savedPagesItemPos = t.getSavedPageItemPosByURL(url);
					
					// Wurde die gespeicherte Seite anhand der URL gefunden?
					if (savedPagesItemPos != -1)
					{
						// Gespeicherte Seite Item anhand der Position auslesen und die ID davon ermitteln.
						var savedPagesItems = t.getSavedPagesItems();
						var savedPagesItem = savedPagesItems[savedPagesItemPos];
						var id = savedPagesItem.id;
					
						var callback = function(response)
						{
							t.handleError(response);
							
							// Auch bei Fehlern die gespeicherte Seite entfernen.
							
							// Aus den Gespeicherten Seiten entfernen.
							t.removeSavedPageItemByID(id);
							
							// Menü Anzeige aktualisieren.
							t.updateMenuCount();
							
							// Auch bei Fehler weiter machen.
							// Callback aufrufen wenn fertig.
							if (doneCallback)
							{
								doneCallback();
							}
						};
						
						// API Call.
						adesso.socialSharing.API.deletePage(callback, key, id);
					}
					else
					{
						if (console)
						{
							console.log("Error id for saved item not found.");
						}
					}
				};
				// Key auslesen ggf. einen neuen anlegen und im Cookie setzten.
				this.getOrCreateKeyWithCookie(keyDoneCallback);
			},
			addPage: function(doneCallback, url, title, description, picture_474x474, picture_948x948, picture_750x500, picture_1500x1000, color)
			{
				var t = this;
				
				var keyDoneCallback = function(key)
				{
					var callback = function(response)
					{
						t.handleError(response);
						
						// Auch bei Fehlern die gespeicherte Seite entfernen.
						// Seiten Item hinzufügen in den gespeicherten, wird nur eingefügt wenn dieser noch nicht existiert.
						var item = {};
						item.id = response.id;
						item.url = url;
						item.title = title;
						item.description = description;
						item.picture_474x474 = picture_474x474;
						item.picture_948x948 = picture_948x948;
						item.picture_750x500 = picture_750x500;
						item.picture_1500x1000 = picture_1500x1000;
						item.color = color;
						t.addSavedPageItem(item);
						
						// Menü Anzeige aktualisieren.
						t.updateMenuCount();
						
						// Auch bei Fehler weiter machen.
						// Callback aufrufen wenn fertig.
						if (doneCallback)
						{
							doneCallback();
						}
					};
					
					// API Call.
					adesso.socialSharing.API.addPage(callback, key, url, title, description, picture_474x474, picture_948x948, picture_750x500, picture_1500x1000, color);
				};
				// Key auslesen ggf. einen neuen anlegen und im Cookie setzten.
				this.getOrCreateKeyWithCookie(keyDoneCallback);
			},
			setPageSavedIconState: function (saved)
			{
				var saveAPageBtn = $(this.adesso_save_a_page_btn_selector);
				var background = saveAPageBtn.find(".adesso-background");
				var iconLink = saveAPageBtn.find(".adesso-save-icon-link");
				var saveActionPlus = saveAPageBtn.find(".adesso-save-icon-link .adesso-save-action .adesso-plus");
				var saveActionMinus = saveAPageBtn.find(".adesso-save-icon-link .adesso-save-action .adesso-minus");
				
				if (saved == true)
				{
					background.removeClass("default-plus");
					background.removeClass("default-minus");
					background.removeClass("deleted");
					background.addClass("saved");
					iconLink.removeClass("minus").addClass("plus");
					
					$(this.adesso_save_a_page_btn_selector).removeClass("mouse-leave");
					$(this.adesso_save_a_page_btn_selector).removeClass("mouse-leave2");
				}
				else
				{
					background.removeClass("default-plus");
					background.removeClass("default-minus");
					background.removeClass("saved");
					background.addClass("deleted");
					iconLink.removeClass("plus").addClass("minus");
					
					$(this.adesso_save_a_page_btn_selector).removeClass("mouse-leave");
					$(this.adesso_save_a_page_btn_selector).removeClass("mouse-leave2");
				}
			},
			updateMainSavedPageIconState: function (state)
			{
				// Korrektur der Oberfläche.
				var saveAPageBtn = $(this.adesso_save_a_page_btn_selector);
				var saveActionPlus = saveAPageBtn.find(".adesso-save-icon-link .adesso-save-action .adesso-plus");
				var saveActionMinus = saveAPageBtn.find(".adesso-save-icon-link .adesso-save-action .adesso-minus");
				
				if ("clear" == state)
				{
					saveActionMinus.css("display", "");
					saveActionMinus.css("color", "");
					saveActionPlus.css("display", "");
				}
				
				if ("minus" == state)
				{
					saveActionMinus.css("display", "block");
					saveActionMinus.css("color", "#b20000");
					saveActionPlus.css("display", "none");
				}
				
				if ("plus" == state)
				{
					saveActionPlus.css("display", "block");
					saveActionMinus.css("display", "none");
				}
			},
			localTouchSupport: function()
			{
				var local_touch_support = false;
				if ("ontouchend" in document)
				{
					local_touch_support = true;
				}
				return local_touch_support;
			},
			addEvents: function()
			{
				var t = this;
				
				// MouseOver über den Seite hinzufügen/entfernen Button.
				$(this.adesso_save_a_page_btn_selector).mouseover(function()
				{
					// Korrektur Oberfläche: Alten Zustand bei MouseOver.
					t.updateMainSavedPageIconState("clear");
				}).mouseleave(function()
				{
					var background = $(this).find(".adesso-background");
					
					if (background.hasClass("saved"))
					{
						$(this).addClass("mouse-leave");
						$(this).removeClass("mouse-leave2");
						// Korrektur Oberfläche: Minus anzeigen.
						t.updateMainSavedPageIconState("minus");
					}
					
					if (background.hasClass("deleted"))
					{
						$(this).removeClass("mouse-leave");
						$(this).addClass("mouse-leave2");
						// Korrektur Oberfläche: Plus anzeigen.
						t.updateMainSavedPageIconState("plus");
					}
					
					// Open für Touch Devices immer entfernen.
					background.removeClass("open");
				});
				
				// Click Seite hinzufügen/entfernen Button.
				$("body").on("click", this.adesso_save_a_page_btn_selector, function()
				{
					var background = $(this).find(".adesso-background");
					
					// Sonderfall für Touch Devices erster Klick öffnet nur, erst der zweite nimmt da Event an.
					var proceedClick = true;
					if (t.localTouchSupport() == true)
					{
						// Noch nicht geöffnet?
						if (background.hasClass("open") == false)
						{
							background.addClass("open");
							proceedClick = false;
						}
					}
					
					// Soll der Klick behandelt werden?
					if (proceedClick == true)
					{
						if (background.hasClass("default-plus") == true || background.hasClass("deleted") == true)
						{
							// Seite soll gespeichert werden.
							
							// Icon Status setzten.
							t.setPageSavedIconState(true);
							
							// Seite speichern.
							t.addPage(null, t.getSavePageURL(), t.getSavePageTitle(), t.getSavePageDescription(), t.getSavePagePicture474x474(), t.getSavePagePicture948x948(), t.getSavePagePicture750x500(), t.getSavePagePicture1500x1000(), t.getSavePageColor());
						}
						else
						{
							if (background.hasClass("default-minus") == true || background.hasClass("saved") == true)
							{
								// Seite soll gelöscht werden.
								
								// Icon Status setzten.
								t.setPageSavedIconState(false);
								
								// Seite löschen.
								t.deletePage(null, t.getSavePageURL());
							}
						}
					}
				});
			}
		},
	
		savedPages:
		{
			identifier_selector: ".adesso-saved-pages-identifier",
			saved_pages_wraper_selector: ".adesso-saved-pages-identifier .adesso-saved-pages-wraper",
			adesso_container_selector: ".adesso-saved-pages-identifier .adesso-container",
			adesso_sharing_selector: ".adesso-saved-pages-identifier .adesso-sharing",
			init: function()
			{
				// Events einhängen.
				this.addEvents();
				
				// Key aus dem Storage auslesen.
				var key = adesso.socialSharing.global.getKey();
				
				// Key vorhanden?
				if (key)
				{
					// Gespeicherte Seiten für den Key laden.
					this.loadItems(key);
					
					// Social Share Links befüllen.
					this.fillSocialShareLinks(key);
				}
				else
				{
					// Text Anzeigen falls keine Gespeicherten Seiten vorhanden sind. 
					this.toggleItemsExistsMsg();
				}
			},
			addEvents: function ()
			{
				var t = this;
				
				// Löschen Event.
				$("body").on("click", this.saved_pages_wraper_selector + " .adesso-close-card", function()
				{
					var id = $(this).attr("data-id");
					t.deleteItem(id, $(this).closest(".card"));
				});
			},
			getItemsCount: function ()
			{
				return $(this.saved_pages_wraper_selector + " .card-img-overlay").length;
			},
			deleteItem: function (id, deleteElement)
			{
				var t = this;

				// Key aus dem Storage auslesen, keine Prüfung ob vorhanden.
				var key = adesso.socialSharing.global.getKey();
				
				var callback = function(response)
				{
					adesso.socialSharing.global.handleError(response);
					
					// Auch bei Fehlern die gespeicherte Seite entfernen.
					// Element ausblenden und entfernen.
					$(deleteElement).fadeOut(function()
					{
						// Element entfernen.
						$(this).remove();
						
						// Auffüllen.
						t.fillingUpItems();
						
						// Text Anzeigen falls keine Gespeicherten Seiten vorhanden sind. 
						t.toggleItemsExistsMsg();

						// Gespeicherte Seite anhand der ID löschen.
						adesso.socialSharing.global.removeSavedPageItemByID(id);
						
						// Menü Anzeige aktualisieren.
						adesso.socialSharing.global.updateMenuCount();
					});
				};
				
				// API Call.
				adesso.socialSharing.API.deletePage(callback, key, id);
			},
			loadItems: function(key)
			{
				var t = this;
				
				// Alle Elemente löschen.
				$(this.saved_pages_wraper_selector).empty();
				
				var callback = function(response)
				{
					if (adesso.socialSharing.global.handleError(response) == false)
					{
						if (response.collection && response.collection.items)
						{
							// Elemente einfügen.
							$.each(response.collection.items, function(index, item)
							{
								var imgAlt = "";
								if (item.title)
								{
									imgAlt = "alt=\"" + item.title.replace(/"/g, '&quot;') + "\"";
								}
								
								// Kein Bild vorhanden?
								var colorClass = "";
								var pictureURL474x474 = item.picture_474x474;
								var pictureURL948x948 = item.picture_948x948;
								var pictureURL750x500 = item.picture_750x500;
								var pictureURL1500x1000 = item.picture_1500x1000;
								
								// Fallback der Auflösungen.
								if (pictureURL948x948 == "")
								{
									pictureURL948x948 = pictureURL474x474;
								}
								if (pictureURL750x500 == "")
								{
									pictureURL750x500 = pictureURL474x474;
								}
								if (pictureURL1500x1000 == "")
								{
									pictureURL1500x1000 = pictureURL474x474;
								}
								
								if (item.picture_474x474 == "")
								{
									// CSS Klasse für die farbige Kachel ausgeben.
									colorClass = " " + item.color;
									
									// Leeres Bild wegen Design anzeigen.
									pictureURL474x474 = "/media/_tech__ad/layout__ad/images__ad/social_sharing_1/social_sharing_app_empty__ad.png";
									pictureURL948x948 = "/media/_tech__ad/layout__ad/images__ad/social_sharing_1/social_sharing_app_empty__ad.png";
									pictureURL750x500 = "/media/_tech__ad/layout__ad/images__ad/social_sharing_1/social_sharing_app_empty__ad.png";
									pictureURL1500x1000 = "/media/_tech__ad/layout__ad/images__ad/social_sharing_1/social_sharing_app_empty__ad.png";
								}
								
								var out = "" +
								"<div class=\"card picture-card col-md-6 col-lg-3\">" +
									"<figure>" +
										"<picture>" +
											"<!--[if IE 9]>" +
											"<video style=\"display: none;\">" +
												"<![endif]-->" +
												"<source srcset=\"" + pictureURL474x474 + " 1x, " + pictureURL948x948 + " 2x\" media=\"(min-width: 768px)\" />" +
												"<source srcset=\"" + pictureURL750x500 + " 1x, " + pictureURL1500x1000 + " 2x\" media=\"(min-width: 0px)\" />" +
												"<!--[if IE 9]>" +
											"</video>" +
											"<![endif]-->" +
											"<img src=\"" + pictureURL474x474 + "\" sizes=\"640vw\" srcset=\"" + pictureURL474x474 + "\" " + imgAlt + "/>" +
										"</picture>" +
									"</figure>" +
									"<div class=\"card-img-overlay adesso-dark-gradient" + colorClass + "\">" +
										"<span data-effect=\"fadeOut\" data-id=\"" + item.id + "\" class=\"pull-xs-right  adesso-close-card\">x</span>" +
										"<div class=\"adesso-stored-items\">";
											if (item.title && item.url)
											{
												out += "<h5 class=\"card-title\"><a href=\"" + item.url + "\">" + item.title + "</a></h5>";
											}
											if (item.description && item.url)
											{
												out += "<p class=\"card-text\"><a href=\"" + item.url + "\">" + item.description + "</a></p>";
											}
											out += "" +
										"</div>" +
									"</div>" +
								"</div>";
								
								var outItem = $(out).hide().fadeIn();
								$(t.saved_pages_wraper_selector).append(outItem);
							});
							
							// Auffüllen.
							t.fillingUpItems();
						}
					}
					
					// Text Anzeigen falls keine Gespeicherten Seiten vorhanden sind. 
					t.toggleItemsExistsMsg();
				};
				
				// API Call.
				adesso.socialSharing.API.getCollection(callback, key);
			},
			fillingUpItems: function()
			{
				// Wirkliche Elemente ohne Lückenfüller.
				var realItemsCount = this.getItemsCount();
				// Gibt es Elemente?
				if (realItemsCount > 0)
				{
					// Lückenfüller einfügen.
					
					// Alle Lückenfüller Elemente löschen.
					$(this.saved_pages_wraper_selector + " .lueckenfueller").remove();

					var diffLength = realItemsCount - (Math.floor(realItemsCount / 4) * 4);
					var fillItemsCount = 0;
					if (diffLength != 0)
					{
						fillItemsCount = 4 - diffLength;
					}
					
					// Müssen Lückenfüller eingefügt werden?
					if (fillItemsCount != 0)
					{
						for (i = 0; i < fillItemsCount; i++)
						{
							// Das erste Lückenfüller Element.
							var firstFillItem = $(this.saved_pages_wraper_selector + " .lueckenfueller").first();

							var fillItem = $("<div data-effect=\"fadeIn\" class=\"lueckenfueller hidden-sm-down col-md-6 col-lg-3 card adesso-box-card adesso-primary-lightgrey\"></div>").hide().fadeIn();
							
							// Gibt es ein Lückenfüller Element bereits?
							if (firstFillItem.length == 0)
							{
								// Einfügen am Ende.
								$(this.saved_pages_wraper_selector).append(fillItem);
							}
							else
							{
								// Vor das erste einfügen.
								$(firstFillItem).before(fillItem);
							}
						}
					}
				}
				else
				{
					// Alle Lückenfüller löschen, gibt keine Elemente in der Liste.
					$(this.saved_pages_wraper_selector + " .lueckenfueller").remove();
				}
			},
			toggleItemsExistsMsg: function()
			{
				// Wirkliche Elemente ohne Lückenfüller.
				var itemsCount = this.getItemsCount();
				
				// Sind noch Gespeicherte Seiten vorhanden?
				if (itemsCount > 0)
				{
					// Gespeicherten Seiten vorhanden.
					$(this.adesso_container_selector + " .adesso-no-saved-pages-info").hide();
					$(this.adesso_container_selector + " .adesso-sharing").show();
				}
				else
				{
					// Keine Gespeicherten Seiten vorhanden.
					$(this.adesso_container_selector + " .adesso-sharing").hide();
					$(this.adesso_container_selector + " .adesso-no-saved-pages-info").show();
				}
			},
			fillSocialShareLinks: function(key)
			{
				// Seiten URL mit Collection Key.
				var pageURLWithParam = window.location + "?k=" + key;
				var pageURLWithParamEncoded = encodeURI(pageURLWithParam);
				
				// Sharing Links befüllen mit der URL und dem Key der Collection.
				$(this.adesso_sharing_selector + " .adesso-social-share-link").each(function()
				{
					var hrefValue = $(this).attr("href");
					hrefValue = hrefValue.replace("###url###", pageURLWithParamEncoded);
					$(this).attr("href", hrefValue)
				});
				
				// E-Mail Mailto anpassen.
				var mailtoElement = $(this.adesso_sharing_selector + " .adesso-social-share-email");
				var mailtoHrefValue = mailtoElement.attr("href");
				var mailtoAppendChar = "?"
				if (mailtoHrefValue.indexOf("mailto:?") == 0)
				{
					mailtoAppendChar = "&";
				}
				mailtoElement.attr("href", mailtoHrefValue + mailtoAppendChar + "body=" + pageURLWithParamEncoded);
			}
		}
	
	};

	$(document).ready(function()
	{
		// Social Sharing API URL setzten.
		adesso.socialSharing.API.apiURL = $("footer").first().attr("data-social-sharing-api");
		
		var doneCheckSharedKeyCallback = function(response)
		{
			var doneCallback = function(response)
			{
				// Befindet man sich auf der "gespeicherten Seiten" Seite?
				if ($(adesso.socialSharing.savedPages.identifier_selector).length > 0)
				{
					adesso.socialSharing.savedPages.init();
				}
			};
			
			// Auf jeder Seite initialisieren.
			adesso.socialSharing.global.init(doneCallback);
		};
		
		// Prüfen ob ein Key einer geteilten Collection übergeben wurde.
		adesso.socialSharing.global.checkSharedKey(doneCheckSharedKeyCallback);
	});
})(window, $);