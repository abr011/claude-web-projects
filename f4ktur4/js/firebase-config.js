/* ==========================================================================
   Firebase Configuration - Centralized
   ========================================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyDrqihmPtjDnEgm2j0rGhR1-QbiIWCmldo",
    authDomain: "invoice-71a47.firebaseapp.com",
    databaseURL: "https://invoice-71a47.firebaseio.com",
    projectId: "invoice-71a47",
    storageBucket: "invoice-71a47.appspot.com",
    messagingSenderId: "845423691647"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database reference
var database = firebase.database();
var firebaseRef = firebase.database().ref();

// Anonymous auth - signs in automatically without user interaction
function checkAuth(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Already signed in (anonymously)
            if (callback) callback(user);
        } else {
            // Sign in anonymously
            firebase.auth().signInAnonymously().catch(function(error) {
                console.error("Anonymous auth error:", error);
            });
        }
    });
}

function signOut() {
    // No-op for anonymous auth
}

// Animation classes (used across all pages)
var animationInRight = "bounce_In_Right";
var animationOutLeft = "bounce_Out_Left";
var animationShake = "animated shake";
var animationFadeInDown = "animated slideInDown";
var animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

// Status symbols
var ok = "&#127867;";
var nok = " ";
