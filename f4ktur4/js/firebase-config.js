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

// Allowed user email (only this account can access)
var ALLOWED_EMAIL = "ales.brom@gmail.com";

// Auth check function - call on every page
function checkAuth(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && user.email === ALLOWED_EMAIL) {
            // User is signed in and authorized
            if (callback) callback(user);
        } else if (user) {
            // User signed in but not authorized
            firebase.auth().signOut();
            window.location.href = "login.html?error=unauthorized";
        } else {
            // No user signed in
            window.location.href = "login.html";
        }
    });
}

// Sign out function
function signOut() {
    firebase.auth().signOut().then(function() {
        window.location.href = "login.html";
    });
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
