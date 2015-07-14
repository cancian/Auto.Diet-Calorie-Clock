//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

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
        var host = document.getElementById("contentHost");
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
})();



//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

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
        var host = document.getElementById("contentHost");
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
})();


//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("index.html", {
        ready: function (element, options) {
            document.getElementById("oAuthFacebookLaunch").addEventListener("click", launchFacebookWebAuth, false);
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

        var clientID = document.getElementById("FacebookClientID").value;
        if (clientID === null || clientID === "") {
            WinJS.log("Enter a ClientID", "Web Authentication SDK Sample", "error");            
            return;
        }

        var callbackURL = document.getElementById("FacebookCallbackURL").value;
        if (!isValidUriString(callbackURL)) {
            WinJS.log("Enter a valid Callback URL for Facebook", "Web Authentication SDK Sample", "error");
            return;
        }

        facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream&display=popup&response_type=token";

        if (authzInProgress) {
            document.getElementById("FacebookDebugArea").value += "\r\nAuthorization already in Progress ...";
            return;
        }

        var startURI = new Windows.Foundation.Uri(facebookURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        document.getElementById("FacebookDebugArea").value += "Navigating to: " + facebookURL + "\r\n";

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
                    document.getElementById("FacebookReturnedToken").value = result.responseData;
                    document.getElementById("FacebookDebugArea").value += "Status returned by WebAuth broker: " + result.responseStatus + "\r\n";
                    getfacebookUserName(result.responseData);
                    if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                        document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
                    }
                    authzInProgress = false;
                }, function (err) {
                    WinJS.log("Error returned by WebAuth broker: " + err, "Web Authentication SDK Sample", "error");
                    document.getElementById("FacebookDebugArea").value += " Error Message: " + err.message + "\r\n";
                    authzInProgress = false;
                });}
    }

    //
    //This function is Continuation handler for Windows Phone App
    //
    function continueWebAuthentication(args)
    {
        var result = args[0].webAuthenticationResult;

        if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.success) {
            document.getElementById("FacebookReturnedToken").value = result.responseData;
        }
        else if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
            document.getElementById("FacebookDebugArea").value += "Error returned: " + result.responseErrorDetail + "\r\n";
        }
        else {
            document.getElementById("FacebookDebugArea").value += "Status returned by WebAuth broker: " + result.responseStatus + "\r\n";
        }
        authzInProgress = false;

    }

    /// <summary>
    /// This function extracts access_token from the response returned from web authentication broker
    /// and uses that token to get user information using facebook graph api. 
    /// </summary>
    function getfacebookUserName(webAuthResultResponseData) {

        var responseData = webAuthResultResponseData.substring(webAuthResultResponseData.indexOf("access_token"));
        var keyValPairs = responseData.split("&");
        var access_token;
        var expires_in;
        for (var i = 0; i < keyValPairs.length; i++) {
            var splits = keyValPairs[i].split("=");
            switch (splits[0]) {
                case "access_token":
                    access_token = splits[1]; //You can store access token locally for further use. See "Account Management" scenario for usage.
                    break;
                case "expires_in":
                    expires_in = splits[1];
                    break;
            }
        }

        document.getElementById("FacebookDebugArea").value += "\r\naccess_token = " + access_token + "\r\n";
        var client =  new Windows.Web.Http.HttpClient();
        client.getStringAsync(new Windows.Foundation.Uri("https://graph.facebook.com/me?access_token=" + access_token)).done(function(result)
        {
            var userInfo = JSON.parse(result);
            document.getElementById("FacebookDebugArea").value += userInfo.name + " is connected!! \r\n";
        });
    }

})();
