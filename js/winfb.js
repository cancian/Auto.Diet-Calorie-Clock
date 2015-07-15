(function () {
    "use strict";
/////////////////////
// SAMPLE-UTILS.JS //
/////////////////////

    // Sample infrastructure internals
    var currentScenarioUrl = null;

    WinJS.Navigation.addEventListener("navigating", function (evt) {
        currentScenarioUrl = evt.detail.location;
		//console.log(currentScenarioUrl);
    });

    var lastError, lastStatus;
    WinJS.log = function (message, tag, type) {
	//console.log('LOG: ' + message);
		/*
        var isError = (type === "error");
        var isStatus = (type === "status");

        if (isError || isStatus) {
            var statusDiv = document.getElementById("statusMessage");
            if (statusDiv) {
                statusDiv.innerText = message;
                if (statusDiv.innerText.length > 0) {
                    if (isError) {
                        lastError = message;
                        statusDiv.style.backgroundColor = "red";
                    } else if (isStatus) {
                        lastStatus = message;
                        statusDiv.style.backgroundColor = "green";
                    }
                } else {
                    statusDiv.style.backgroundColor = "";
                }
            }
        }*/
    };
/*
    var header = WinJS.UI.Pages.define("/sample-utils/header.html", {
        processed: function (element, options) {
            return WinJS.Binding.processAll(element);
        }
    });

    // Control that populates and runs the scenario selector
    var ScenarioSelect = WinJS.UI.Pages.define("/sample-utils/scenario-select.html", {
        ready: function (element, options) {
            var that = this;

            element.addEventListener("selectionchanging", function (evt) {
                if (evt.detail.newSelection.count() === 0) {
                    evt.preventDefault();
                }
            });
            element.addEventListener("iteminvoked", function (evt) {
                evt.detail.itemPromise.then(function (item) {
                    that._selectedIndex = item.index;
                    var newUrl = item.data.url;
                    if (currentScenarioUrl !== newUrl) {
                        WinJS.Navigation.navigate(newUrl);
                    }
                });
            });
            element.addEventListener("keyboardnavigating", function (evt) {
                var listview = evt.target.winControl;
                listview.elementFromIndex(evt.detail.newFocus).click();
            });

            this._selectedIndex = 0;

            var lastUrl = WinJS.Application.sessionState.lastUrl;
            SdkSample.scenarios.forEach(function (s, index) {
                s.scenarioNumber = index + 1;
                if (s.url === lastUrl && index !== that._selectedIndex) {
                    that._selectedIndex = index;
                }
            });

            this._listview = element.querySelector(".win-listview").winControl;
            this._listview.selection.set([this._selectedIndex]);
            this._listview.currentItem = { index: this._selectedIndex, hasFocus: true };
        }
    });

    // SDK Sample Test helper
    document.TestSdkSample = {
        getLastError: function () {
            return lastError;
        },

        getLastStatus: function () {
            return lastStatus;
        },

        selectScenario: function (scenarioID) {
            scenarioID = scenarioID >> 0;
            var scenarioIndex = scenarioID - 1;
            var scenarioControl = document.querySelector("#scenarioControl").winControl;
            scenarioControl.elementFromIndex(scenarioIndex).click();
        }
    };
	*/



////////////////
// DEFAULT.JS //
////////////////
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var activationKinds = Windows.ApplicationModel.Activation.ActivationKind;

    function activated(eventObject) {
        var activationKind = eventObject.detail.kind;
        var activatedEventArgs = eventObject.detail.detail;

        // Handle launch and continuation activation kinds
        switch (activationKind) {
            case activationKinds.launch:
            case activationKinds.pickFileContinuation:
            case activationKinds.pickSaveFileContinuation:
            case activationKinds.pickFolderContinuation:
            case activationKinds.webAuthenticationBrokerContinuation:
                var p = WinJS.UI.processAll().
                    then(function () {

                        // Navigate to either the first scenario or to the last running scenario
                        // before suspension or termination.
                        var url = "index.html";
                        var initialState = {};
                        var navHistory = app.sessionState.navigationHistory;
                        if (navHistory) {
                            nav.history = navHistory;
                            url = navHistory.current.location;
                            initialState = navHistory.current.state || initialState;
                        }
                        initialState.activationKind = activationKind;
                        initialState.activatedEventArgs = activatedEventArgs;
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(url, initialState);
                    });

                // Calling done on a promise chain allows unhandled exceptions to propagate.
                p.done();

                // Use setPromise to indicate to the system that the splash screen must not be torn down
                // until after processAll and navigate complete asynchronously.
                eventObject.setPromise(p);
                break;

            default:
                break;
        }
    }

    function navigating(eventObject) {
        var url = eventObject.detail.location;
        var host = document.getElementById("fb-root");
        var isNavigatingBack = eventObject.detail.delta < 0;
        var animationType = WinJS.UI.PageNavigationAnimation.turnstile;
        var animations = WinJS.UI.Animation.createPageNavigationAnimations(animationType, animationType, isNavigatingBack);

        var p = animations.exit(host.children).
            then(function () {
                // Call unload and dispose methods on current scenario, if any exist
                if (host.winControl) {
                    host.winControl.unload && host.winControl.unload();
                    host.winControl.dispose && host.winControl.dispose();
                }
                WinJS.Utilities.disposeSubTree(host);
                WinJS.Utilities.empty(host);
                return WinJS.UI.Pages.render(url, host, eventObject.detail.state);
            }).
            then(function () {
                var navHistory = nav.history;
                app.sessionState.navigationHistory = {
                    backStack: navHistory.backStack.slice(0),
                    forwardStack: navHistory.forwardStack.slice(0),
                    current: navHistory.current
                };
                app.sessionState.lastUrl = url;
                return animations.entrance(host.children);
            });
        p.done();
        eventObject.detail.setPromise(p);
    }

    nav.addEventListener("navigating", navigating);
    app.addEventListener("activated", activated, false);
    app.start();





//////////////////////
// OAUTHFACEBOOK.JS //
//////////////////////
    var page = WinJS.UI.Pages.define("index.html", {
        ready: function (element, options) {
            //document.getElementById("oAuthFacebookLaunch").addEventListener("click", launchFacebookWebAuth, false);
			console.log('ready');
            //resetSessionState();

            // Continuation handlers are specific to Windows Phone.
            if (options && options.activationKind === Windows.ApplicationModel.Activation.ActivationKind.webAuthenticationBrokerContinuation) {
                continueWebAuthentication(options.activatedEventArgs);
	        }

	}
    });

    function isValidUriString(uriString) {
        var uri = null;
        try {
            uri = new Windows.Foundation.Uri(uriString);
        }
        catch (err) {
        }
        return uri !== null;
    }

    var authzInProgress = false;

    function launchFacebookWebAuth() {
        var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";

        var clientID = '577673025616946';
        if (clientID === null || clientID === "") {
            WinJS.log("Enter a ClientID", "Web Authentication SDK Sample", "error");            
            return;
        }

        var callbackURL = 'https://www.facebook.com/connect/login_success.html';
        if (!isValidUriString(callbackURL)) {
            WinJS.log("Enter a valid Callback URL for Facebook", "Web Authentication SDK Sample", "error");
            return;
        }

        facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream&display=popup&response_type=token";

        if (authzInProgress) {
            console.log('Authorization already in Progress ...');
            return;
        }

        var startURI = new Windows.Foundation.Uri(facebookURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        console.log("Navigating to: " + facebookURL + "\r\n");

        authzInProgress = true;

        if (Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAndContinue)
        {
            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAndContinue(startURI, endURI, null, Windows.Security.Authentication.Web.WebAuthenticationOptions.none);
        }
        else
        {

            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
                .done(function (result) {
                    getTokenFB(result);
                    if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                        console.log("Error returned: " + result.responseErrorDetail);
                    }
                    authzInProgress = false;
                }, function (err) {
                    WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
                    console.log("Error Message: " + err.message);
                    authzInProgress = false;
                });
			}
    }

    //
    //This function is Continuation handler for Windows Phone App
    //
    function continueWebAuthentication(args)
    {
        var result = args[0].webAuthenticationResult;

        if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.success) {
            //document.getElementById("FacebookReturnedToken").value = result.responseData;
			getTokenFB(result);
        }
        else if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
            console.log("Error returned: " + result.responseErrorDetail);
        }
        else {
            console.log("Status returned by WebAuth broker: " + result.responseStatus);
        }
        authzInProgress = false;

    }










})();


