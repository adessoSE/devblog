(function(window, $) {

	if(typeof window.adesso === "undefined") {
		window.adesso = {};
	}

	window.adesso.search =
	{
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
							ret = decodeURIComponent(parameterNameAndValue[1].replace(/\+/g , "%20"));
						}
					}
				}
				return ret;
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
		global:
		{
			apiURL: "",
			language: "",
			site: "",
			rows: 1,
			identifier_selector: ".adesso-search-results-identifier",
			adesso_search_results_selector: ".adesso-search-results-identifier .adesso-search-results-list",
			adesso_search_filter_update_btn_selector: ".adesso-search-results-identifier .adesso-search-filter-update-btn",
			adesso_search_headline_numfound_selector: ".adesso-search-results-identifier .adesso-search-headline-numfound",
			adesso_search_result_count_adesso_selector: ".adesso-search-results-identifier .adesso-search-meta-filter-adesso .search-result-count",
			adesso_search_result_count_casestudies_selector: ".adesso-search-results-identifier .adesso-search-meta-filter-casestudies .search-result-count",
			adesso_search_result_count_newsroom_selector: ".adesso-search-results-identifier .adesso-search-meta-filter-newsroom .search-result-count",
			adesso_search_result_count_jobs_selector: ".adesso-search-results-identifier .adesso-search-meta-filter-jobs .search-result-count",
			adesso_search_pagination_selector: ".adesso-search-results-identifier .adesso-pagination",
			adesso_search_filter_toggle_btn_selector: ".adesso-search-results-identifier .adesso-search-filter-toggle-btn",
			adesso_search_filter_branche_selector: ".adesso-search-results-identifier .adesso-search-filter-branche",
			adesso_search_filter_format_selector: ".adesso-search-results-identifier .adesso-search-filter-format",
			adesso_search_filter_sort_selector: ".adesso-search-results-identifier .adesso-search-filter-sort",
			adesso_header_search_field_selector: ".adesso-header-search-field",
			adesso_search_filter_result_count_selector: ".adesso-search-filter-result-count",
			adesso_search_meta_filter: ".adesso-search-meta-filter",
			adesso_search_content_types_adesso: "page,pdf",
			adesso_search_content_types_casestudies: "insight",
			adesso_search_content_types_newsroom: "news,blog,event",
			adesso_search_content_types_jobs: "jobs",
			label_results_last_update: "zuletzt aktualisiert am",
			label_paging_prev: "Zurück",
			label_paging_next: "Weiter",
			label_no_results_found: "Es wurde leider nichts gefunden.",
			initSearch: function()
			{
				adesso.search.global.apiURL = $(adesso.search.global.identifier_selector).attr("data-url");
				adesso.search.global.language = $(adesso.search.global.identifier_selector).attr("data-language");
				adesso.search.global.site = $(adesso.search.global.identifier_selector).attr("data-site");
				adesso.search.global.rows = $(adesso.search.global.identifier_selector).attr("data-rows");
				adesso.search.global.label_results_last_update = $(adesso.search.global.identifier_selector).attr("data-label-lastUpdate");
				adesso.search.global.label_paging_prev = $(adesso.search.global.identifier_selector).attr("data-label-prev");
				adesso.search.global.label_paging_next = $(adesso.search.global.identifier_selector).attr("data-label-next");
				adesso.search.global.label_no_results_found = $(adesso.search.global.identifier_selector).attr("data-label-no-results-found");
				
				// Filter zurücksetzten.
				$.each($(this.adesso_search_filter_branche_selector + " input"), function(index, element)
				{
					$(element).prop("checked", false);
				});
				$.each($(this.adesso_search_filter_format_selector + " input"), function(index, element)
				{
					$(element).prop("checked", false);
				});
				
				// Events einhängen.
				this.addEvents();
				
				// Suchparameter auslesen und setzten.
				var parameterSearchValue = adesso.search.urlParameters.get("s");
				if (parameterSearchValue)
				{
					adesso.socialSharing.sessionStorage.set("adesso-search-value", parameterSearchValue);
				}
				else
				{
					adesso.socialSharing.sessionStorage.set("adesso-search-value", null);
				}

				// Sucheingabe ins Suchfeld setzten.
				$(this.adesso_header_search_field_selector).val(parameterSearchValue);
				
				// Such Werte initial setzten.
				adesso.socialSharing.sessionStorage.set("adesso-search-numfound", 0);
				adesso.socialSharing.sessionStorage.set("adesso-search-current-page", 1);
				
				// Filter Werte initial setzten.
				adesso.socialSharing.sessionStorage.set("adesso-search-filter-brancheIDs", "");
				adesso.socialSharing.sessionStorage.set("adesso-search-filter-formats", "");
				adesso.socialSharing.sessionStorage.set("adesso-search-filter-sort", $(this.adesso_search_filter_sort_selector + " input:checked").first().val());
				adesso.socialSharing.sessionStorage.set("adesso-search-current-meta-filter", "adesso");
								
				// Suchergebnisse laden.
				this.loadSearchResults();
				
				// Filter gefundene Anzahl setzen pro Branche und Format.
				this.updateMetaFilterAllCounter();
				this.updateFilterResultCount();
			},
			addEvents: function()
			{
				var t = this;
				
				// Filter anwenden Button.
				$("body").on("click", this.adesso_search_filter_update_btn_selector, function(event)
				{
					event.preventDefault();
					
					// Alle ausgewählten Branchen auslesen.
					var brancheIDsFilter = "";
					$.each($(t.adesso_search_filter_branche_selector + " input"), function(index, element)
					{
						if ($(element).is(":checked"))
						{
							var brancheID = $(element).val();
							if (brancheIDsFilter != "")
							{
								brancheIDsFilter += ",";
							}
							brancheIDsFilter += brancheID;
						}
					});
					adesso.socialSharing.sessionStorage.set("adesso-search-filter-brancheIDs", brancheIDsFilter);
					
					// Alle ausgewählten Formate auslesen.
					var formatsFilter = "";
					$.each($(t.adesso_search_filter_format_selector + " input"), function(index, element)
					{
						if ($(element).is(":checked"))
						{
							var formatValue = $(element).val();
							if (formatsFilter != "")
							{
								formatsFilter += ",";
							}
							formatsFilter += formatValue;
						}
					});
					adesso.socialSharing.sessionStorage.set("adesso-search-filter-formats", formatsFilter);
					
					// Sortierung auslesen.
					var sortFilter = $(t.adesso_search_filter_sort_selector + " input:checked").val();
					adesso.socialSharing.sessionStorage.set("adesso-search-filter-sort", sortFilter);
					
					// Paging Wert und gefunden Anzahl zurücksetzten.
					adesso.socialSharing.sessionStorage.set("adesso-search-numfound", 0);
					adesso.socialSharing.sessionStorage.set("adesso-search-current-page", 1);
					
					// Suchergebnisse für diese Seite laden.
					t.loadSearchResults();
					
					t.updateMetaFilterAllCounter();
					t.updateFilterResultCount();
					t.updateNumFound();
					
					// Filter wieder ausblenden.
					$(t.adesso_search_filter_toggle_btn_selector).click();
				});
				
				// Klick auf Paging Seitenauswahl.
				$("body").on("click", this.adesso_search_pagination_selector + " a", function(event)
				{
					event.preventDefault();
					
					// Aktuelle Seite die ausgewählt ist.
					var currentPage = adesso.socialSharing.sessionStorage.get("adesso-search-current-page");
					
					var href = $(this).attr("href");
					if (href != "#" && href != "")
					{
						// Ist es nicht die aktuelle Seite?
						if (href != currentPage)
						{
							// Neue Seitenzahl setzten. 
							adesso.socialSharing.sessionStorage.set("adesso-search-current-page", href);
							
							// Suchergebnisse für diese Seite laden.
							t.loadSearchResults();
						}
					}
					
				});

				// Klick auf Meta Filter
				$("body").on("click", this.adesso_search_meta_filter, function(event)
				{
					event.preventDefault();
					adesso.socialSharing.sessionStorage.set("adesso-search-current-page", 1);
					adesso.socialSharing.sessionStorage.set("adesso-search-current-meta-filter", $(this).attr("data-filter-value"));

					// Suchergebnisse für diesen Filter laden.
					t.loadSearchResults();
				});
			},
			updateFilterResultCount: function()
			{
				var t = this;
				
				// Alle Werte auf 0 zurücksetzten.
				$(this.adesso_search_filter_branche_selector + " " + this.adesso_search_filter_result_count_selector).html("(0)");
				$(this.adesso_search_filter_format_selector + " " + this.adesso_search_filter_result_count_selector).html("(0)");
				
				var searchValue = adesso.socialSharing.sessionStorage.get("adesso-search-value");
				var formatsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-formats");
				var brancheIDsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-brancheIDs");

				if (searchValue && searchValue != "")
				{
					// Such Wert Parameter erzeugen.
					var searchValueParam = this.makeSearchValueParam(searchValue);
					
					// Anzahl Ergebnisse pro Branchen ermitteln.
					var brancheParams = {
						language: adesso.search.global.language,
						site: adesso.search.global.site,
						rows: 99999999,
						searchText: searchValueParam,
						contentTypes: formatsFilter,
						brancheIDs: brancheIDsFilter,
						groupField: "branche_id"
					};
					
					$.ajax({
						url: adesso.search.global.apiURL,
						data: brancheParams,
						method: "post",
						dataType: "json",
						success: function (data)
						{
							if (data.grouped && data.grouped.branche_id && data.grouped.branche_id.groups)
							{
								$.each(data.grouped.branche_id.groups, function(index, group)
								{
									// Ist ein Wert gesetzt?
									if (group.groupValue && group.groupValue != "")
									{
										if (group.doclist && group.doclist.numFound)
										{
											// Anhand der Groupvalue die Anzahl der gefundenen im Filter setzten.
											$(t.adesso_search_filter_branche_selector + " [data-filter-value='" + group.groupValue + "'] " + t.adesso_search_filter_result_count_selector).html("(" + group.doclist.numFound + ")");
										}
									}
								});
							}
						},
						error: function(jqXHR, textStatus, errorThrown)
						{
							t.handleError(jqXHR);
						}
					});
					
					// Anzahl Ergebnisse pro Formate ermitteln.
					var contentTypeParams = {
						language: adesso.search.global.language,
						site: adesso.search.global.site,
						rows: 99999999,
						searchText: searchValueParam,
						contentTypes: formatsFilter,
						brancheIDs: brancheIDsFilter,
						groupField: "content_type_keyword"
					};
					$.ajax({
						url: adesso.search.global.apiURL,
						data: contentTypeParams,
						method: "post",
						dataType: "json",
						success: function (data)
						{
							t.updateNumFound();

							if (data.grouped && data.grouped.content_type_keyword && data.grouped.content_type_keyword.groups)
							{
								$.each(data.grouped.content_type_keyword.groups, function(index, group)
								{
									// Ist ein Wert gesetzt?
									if (group.groupValue && group.groupValue != "")
									{
										if (group.doclist && group.doclist.numFound)
										{
											// Anhand der Groupvalue die Anzahl der gefundenen im Filter setzten.
											$(t.adesso_search_filter_format_selector + " [data-filter-value='" + group.groupValue + "'] " + t.adesso_search_filter_result_count_selector).html("(" + group.doclist.numFound + ")");
										}
									}
								});
							}
						},
						error: function(jqXHR, textStatus, errorThrown)
						{
							t.handleError(jqXHR);
						}
					});
				}
			},
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
						console.log("Error search:" + statusCode);
					}
				}
				return ret;
			},
			makeDisplayDate: function(date)
			{
				var dateDisplay = "";
				if (date) {
					var dateDay = date.getDate();
					var dateMonth = date.getMonth() + 1;
					
					if (dateDay < 10)
					{
						dateDisplay += "0";
					}
					dateDisplay += dateDay + ".";
					
					if (dateMonth < 10)
					{
						dateDisplay += "0";
					}
					dateDisplay += dateMonth + "." + date.getFullYear();
				}
				return dateDisplay;
			},
			updateNumFound: function(value)
			{
				if(value === undefined){
					newValue = adesso.socialSharing.sessionStorage.get("adesso-search-meta-filter-counter");
				}
				else {
					newValue = value;
				}
				$(this.adesso_search_headline_numfound_selector).html(newValue);
				adesso.socialSharing.sessionStorage.set("adesso-search-numfound", newValue);
			},
			checkExists: function(givenString, array)
			{
				var retVal = false;
				if (array && array.length == 0) {
					retVal = true;
				}
				else {
					$.each(array, function(i, value) {
						if (givenString.indexOf(value) > -1) {
							retVal = true;
						}
					});
				}
				return retVal;
			},
			updateMetaFilterCounter: function(metaFilter)
			{
				var t = this;
				var searchValue = adesso.socialSharing.sessionStorage.get("adesso-search-value");
				var siteNameVar = adesso.search.global.site.replace(/ /g , "_").replace(/\./g , "_");
				
				// Aktuelle Seite die ausgewählt ist.
				var currentPage = parseInt(adesso.socialSharing.sessionStorage.get("adesso-search-current-page"));
				
				// Startberechnen.
				var start = 0;
				if (currentPage > 1)
				{
					start = (currentPage - 1) * adesso.search.global.rows;
				}
				
				// Filter Werte.
				var brancheIDsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-brancheIDs");
				var formatsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-formats");
				var sortFilter = "score";
				
				// Such Wert Parameter erzeugen.
				var searchValueParam = this.makeSearchValueParam(searchValue);
				var currentMetaFilterContentTypesParam = this.getMetaFilterContentTypesParam(metaFilter);
				var params = {
					language: adesso.search.global.language,
					site: adesso.search.global.site,
					rows: adesso.search.global.rows,
					start: 0,
					searchText: searchValueParam,
					brancheIDs: brancheIDsFilter,
					contentTypes: formatsFilter,
					metaContentTypes: currentMetaFilterContentTypesParam,
					sort: sortFilter,
				};
				adesso.socialSharing.sessionStorage.set("adesso-search-meta-filter-counter", 0);
				adesso.socialSharing.sessionStorage.set("adesso-search-settings", params);
				$(t.adesso_search_result_count_adesso_selector).html("(0)");
				$(t.adesso_search_result_count_casestudies_selector).html("(0)");
				$(t.adesso_search_result_count_newsroom_selector).html("(0)");
				$(t.adesso_search_result_count_jobs_selector).html("(0)");
				$.ajax({
					url: adesso.search.global.apiURL,
					data: params,
					method: "post",
					dataType: "json",
					success: function (data)
					{
						if (data.response)
						{
							// Anzahl der gefunden Einträge setzen.
							var currentCounter = adesso.socialSharing.sessionStorage.get("adesso-search-meta-filter-counter");
							var currentCounterInt = parseInt(currentCounter);
							// Anzahl der gefunden Einträge erhöhen.
							if (data.requestParams && data.requestParams.fq) {
								var keyIndicator = "content_type_multi_keyword";
								var contentTypesCollected1 = [];
								var contentTypesCollected2 = [];
								var useSecond = false;
							
								// Annahme: es gibt max 2 Parameter mit Key keyIndicator
								$.each(data.requestParams.fq, function(i, actualValue) {
									if (actualValue.indexOf(keyIndicator) > 0) {										
										var possibleValues = actualValue.split(" OR ");
										$.each(possibleValues, function(i, possibleValue) {
											var valuePart = possibleValue.replace("(", "").replace(")", "");
											valuePart = valuePart.substring(valuePart.indexOf(keyIndicator) + keyIndicator.length + 1, valuePart.length);
											if (useSecond) {
												contentTypesCollected2.push(valuePart);
											}
											else {
												contentTypesCollected1.push(valuePart);
											}
										});
										useSecond = true;
									}
								});

								if (t.checkExists(t.adesso_search_content_types_adesso, contentTypesCollected1) == true && t.checkExists(t.adesso_search_content_types_adesso, contentTypesCollected2) == true) {
									$(t.adesso_search_result_count_adesso_selector).html("("+data.response.numFound+")");
									adesso.socialSharing.sessionStorage.set("adesso-search-meta-filter-counter", currentCounterInt + data.response.numFound);							
								}
								if (t.checkExists(t.adesso_search_content_types_casestudies, contentTypesCollected1) == true && t.checkExists(t.adesso_search_content_types_casestudies, contentTypesCollected2) == true) {
									$(t.adesso_search_result_count_casestudies_selector).html("("+data.response.numFound+")");
									adesso.socialSharing.sessionStorage.set("adesso-search-meta-filter-counter", currentCounterInt + data.response.numFound);
								}
								if (t.checkExists(t.adesso_search_content_types_newsroom, contentTypesCollected1) == true && t.checkExists(t.adesso_search_content_types_newsroom, contentTypesCollected2) == true) {
									$(t.adesso_search_result_count_newsroom_selector).html("("+data.response.numFound+")");
									adesso.socialSharing.sessionStorage.set("adesso-search-meta-filter-counter", currentCounterInt + data.response.numFound);
								}
								else if (t.checkExists(t.adesso_search_content_types_jobs, contentTypesCollected1) == true && t.checkExists(t.adesso_search_content_types_jobs, contentTypesCollected2) == true) {
									$(t.adesso_search_result_count_jobs_selector).html("("+data.response.numFound+")");
									adesso.socialSharing.sessionStorage.set("adesso-search-meta-filter-counter", currentCounterInt + data.response.numFound);
								}									
							}							
						}
					},
					error: function(jqXHR, textStatus, errorThrown)
					{
						t.handleError(jqXHR);
					}
				});
			},
			updateMetaFilterAllCounter: function()
			{
				this.updateMetaFilterCounter("adesso");
				this.updateMetaFilterCounter("insights");
				this.updateMetaFilterCounter("newsroom");
				this.updateMetaFilterCounter("jobs");
				// Filter gefundene Anzahl setzen pro Branche und Format.
				this.updateFilterResultCount();

			},
			updatePaging: function(numItems)
			{
				var t = this;
				var out = "";
				
				// Wurde überhaupt etwas gefunden?
				if (numItems > 0)
				{
					var rows = adesso.search.global.rows;

					// Anzahl der Seiten berechnen.
					var pages = Math.ceil(numItems/rows);
	
					if (pages > 1) {					
						// Aktuelle Seite die ausgewählt ist.
						var currentPage = parseInt(adesso.socialSharing.sessionStorage.get("adesso-search-current-page"));
						
						// Seite Zurück.
						var pageBack = currentPage - 1;
						var pageBackDisabledClass = "";
						var pageBackHref = pageBack;
						if (pageBack <= 0)
						{
							pageBackDisabledClass = " disabled";
							pageBackHref = "#";
						}
						out += "" +
						"<li class=\"page-item" + pageBackDisabledClass + "\">" +
							"<a class=\"page-link\" href=\"" + pageBackHref + "\" aria-label=\"" + t.label_paging_prev + "\">" +
								"<span aria-hidden=\"true\">" +
									"<svg class=\"adesso-pfeil-icon adesso-prev\">" +
										"<use xlink:href=\"#adesso--pfeil\" />" +
									"</svg>" +
								"</span>" +
								"<span class=\"sr-only\">" + t.label_paging_prev + "</span>" +
							"</a>" +
						"</li>";
				
						// Seiten Zahlen ausgeben.
						var dotsSetSmaller = false;
						var dotsSetLarger = false;
						for (var i = 1; i <= pages; i++)
						{
							var pageActiveClass = "";
							if (i == currentPage)
							{
								pageActiveClass = " active";
							}
							if ((i == 1) || ((i >= (currentPage - 1)) && (i <= (currentPage + 1))) || (i == pages)) {
								out += "<li class=\"page-item" + pageActiveClass + "\"><a class=\"page-link\" href=\"" + i + "\">" + i + "</a></li>";
							}
							else {
								if ((i < (currentPage - 1) && (i > 1)) && dotsSetSmaller == false) {
									out += "<li class=\"page-item\"><span class=\"page-link\">...</span></li>";
									dotsSetSmaller = true;
								}
								if ((i > (currentPage + 1) && (i < pages)) && dotsSetLarger == false) {
									out += "<li class=\"page-item\"><span class=\"page-link\">...</span></li>";
									dotsSetLarger = true;
								}
							}
						}
				
						// Seite Weiter.
						var pageNext = currentPage + 1;
						var pageNextDisabledClass = "";
						var pageNextHref = pageNext;
						if (pageNext > pages && pageNext > pages)
						{
							pageNextDisabledClass = " disabled";
							pageNextHref = "#";
						}
						out += "" +
						"<li class=\"page-item" + pageNextDisabledClass + "\">" +
							"<a class=\"page-link\" href=\"" + pageNextHref + "\" aria-label=\"" + t.label_paging_next + "\">" +
								"<span aria-hidden=\"true\">" +
									"<svg class=\"adesso-pfeil-icon adesso-next\">" +
										"<use xlink:href=\"#adesso--pfeil\" />" +
									"</svg>" +
								"</span>" +
								"<span class=\"sr-only\">" + t.label_paging_next + "</span>" +
							"</a>" +
						"</li>";
					}
				}
				
				// Alle Elemente löschen.
				$(this.adesso_search_pagination_selector).empty();
				
				var outItem = $(out).hide().fadeIn();
				$(this.adesso_search_pagination_selector).append(outItem);
			},
			addNoResultsFound: function()
			{
				var t = this;
				
				var out = "" +
				"<div class=\"adesso-serach-result-elem m-b-2 m-t-2\">" +
					"<h6>" + t.label_no_results_found + "</h6>" +
				"</div>";
				
				var outItem = $(out).hide().fadeIn();
				$(t.adesso_search_results_selector).append(outItem);
			},
			makeSearchValueParam: function(searchValue)
			{
				var searchValueParam = searchValue;
				if (searchValue && searchValue != "")
				{
					searchValueParam = "*" + searchValue + "*";
				}
				return searchValueParam;
			},
			getMetaFilterContentTypesParam: function(currentMetaFilter)
			{
				var metaFilterContentTypes = "";
				if (currentMetaFilter == "adesso") {
					metaFilterContentTypes = this.adesso_search_content_types_adesso;
				}
				else if (currentMetaFilter == "insights") {
					metaFilterContentTypes = this.adesso_search_content_types_casestudies;
				}
				else if (currentMetaFilter == "newsroom") {
					metaFilterContentTypes = this.adesso_search_content_types_newsroom;
				}
				else if (currentMetaFilter == "jobs") {
					metaFilterContentTypes = this.adesso_search_content_types_jobs;
				}
				return metaFilterContentTypes;
			},
			loadSearchResults: function()
			{
				var t = this;
				var searchValue = adesso.socialSharing.sessionStorage.get("adesso-search-value");
				var siteNameVar = adesso.search.global.site.replace(/ /g , "_").replace(/\./g , "_");
				var currentMetaFilter = adesso.socialSharing.sessionStorage.get("adesso-search-current-meta-filter");
				var metaFilterContentTypes = this.getMetaFilterContentTypesParam(currentMetaFilter);

				// Aktuelle Seite die ausgewählt ist.
				var currentPage = parseInt(adesso.socialSharing.sessionStorage.get("adesso-search-current-page"));
				
				// Startberechnen.
				var start = 0;
				if (currentPage > 1)
				{
					start = (currentPage - 1) * adesso.search.global.rows;
				}
				
				// Filter Werte.
				var brancheIDsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-brancheIDs");
				var formatsFilter = adesso.socialSharing.sessionStorage.get("adesso-search-filter-formats");
				var sortFilterParam = adesso.socialSharing.sessionStorage.get("adesso-search-filter-sort");
				var sortFilter = "score";
				if (sortFilterParam)
				{
					sortFilter = sortFilterParam;
				}
				
				// Such Wert Parameter erzeugen.
				var searchValueParam = this.makeSearchValueParam(searchValue);
				
				var params = {
					language: adesso.search.global.language,
					site: adesso.search.global.site,
					rows: adesso.search.global.rows,
					start: start,
					searchText: searchValueParam,
					brancheIDs: brancheIDsFilter,
					contentTypes: formatsFilter,
					metaContentTypes: metaFilterContentTypes,
					sort: sortFilter,
				};
				// Alle Elemente löschen.
				$(this.adesso_search_results_selector).empty();
				
				// Wurde ein Suchwert überhaupt gesetzt?
				if (searchValue && searchValue != "")
				{
					$.ajax({
						url: adesso.search.global.apiURL,
						data: params,
						method: "post",
						dataType: "json",
						success: function (data)
						{
							if (data.response)
							{
								// Wurde nichts gefunden?
								if (data.response.numFound == 0)
								{
									t.addNoResultsFound();
								}
								
								// Paging aktualisieren.
								t.updatePaging(data.response.numFound);

								if (data.response.docs)
								{
									$.each(data.response.docs, function(index, doc)
									{
										var title = "";
										if (doc.title)
										{
											title = doc.title;
										}
										
										var date;
										if (doc.date_l)
										{
											date = new Date(doc.date_l);
										}
										else if (doc.date_date) {
											date = new Date(doc.date_date);
										}
										var dateDisplay = t.makeDisplayDate(date);
										
										var brancheName = null;
										if (doc.branche_name)
										{
											brancheName = doc.branche_name;
										}
										else if(doc.topic)
										{
											brancheName = doc.topic;
										}
										
										var linkURL = "";

										if (doc.content_type_multi_keyword[0] == "page" || doc.content_type_multi_keyword[0] == "pdf")
										{
											linkURL = doc.link;
										}
										else
										{
											linkURL = doc["link_" + siteNameVar];
										}
										
										var displayContent = null;
										
										if (data.highlighting[doc.uid] && data.highlighting[doc.uid].content)
										{
											// Die Anzahl der Zeichen ist im Highlighting-Ergebnis auf etwa 200 begrenzt
											displayContent = data.highlighting[doc.uid].content[0];
										}										
										else if (doc.display_content)
										{
											displayContent = doc.display_content;
											// Nur maximal 200 Zeichen anzeigen.
											if (displayContent.length > 200)
											{
												displayContent = displayContent.substring(0, 200);
											}
										}

										if(displayContent.length > 150){
											 displayContent = displayContent + "...";
										}

										var out = "" +
										"<div class=\"adesso-serach-result-elem m-b-2 m-t-2\">" +
											"<h6><a href='" + linkURL + "'>" + title + "</a></h6>";
										
											if (displayContent && displayContent != "")
											{
												out += "<p>" + displayContent + "</p>";
											}
										
										out += "" +
											"<ul>";
											
											if (brancheName && brancheName != "")
											{
												out += "<li>" + brancheName + "</li>";
											}
											
										out += "" +
												"<li>" + t.label_results_last_update + " " + dateDisplay + "</li>" +
												"<li><a href=\"" + linkURL + "\">" + linkURL + "</a></li>" +
											"</ul>" +
										"</div>";
										
										var outItem = $(out).hide().fadeIn();
										$(t.adesso_search_results_selector).append(outItem);
									});
								}
							}
						},
						error: function(jqXHR, textStatus, errorThrown)
						{
							t.handleError(jqXHR);
						}
					});
				}
				else
				{
					// Nichts gefunden anzeigen.
					t.updateNumFound(0);
					t.addNoResultsFound();

					// Meta Filter aktualisieren.
					t.updateMetaFilterAllCounter();
				}
			},
			initAutoComplete: function()
			{
				// Altes zuvor entfernen, damit der cache Parameter übernommen wird.
				$("input.flexdatalist").flexdatalist("destroy");
				
				// Überschreiben der Parameter.
				$("input.flexdatalist").flexdatalist({
					cache: false,
					url: $("input.flexdatalist").attr("data-url"),
					params: {
						autocomplete: "true",
						site: $("input.flexdatalist").attr("data-site"),
						language: $("input.flexdatalist").attr("data-language")
					}
				});
			}
		}
	
	};

	$(document).ready(function()
	{
		adesso.search.global.initAutoComplete();

		// Befindet man sich auf der "Suchergebnisse" Seite?
		if ($(adesso.search.global.identifier_selector).length > 0)
		{
			adesso.search.global.initSearch();
		}
	});
})(window, $);