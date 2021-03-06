(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ask,
    assets,
    data = [ ],
    dom,
    done,
    error,
    grab,
    index = 0,
    kickoff,
    load,
    parse,
    progress,
    reset,
    start,
    total;
    
assets = [
  'vendor/firebase-2.0.4.js',
  'vendor/phaser-2.2.2.js',
  'script/game.js',
  'image/layer01.png',
  'image/layer02.png',
  'image/layer03.png',
  'image/meteor.png',
  'image/spaceship-spr.png',
  'sound/boost.ogg',
  'sound/boost.mp3',
];

dom = {
  go: '.landing-go',
  input: '.landing-input',
  landing: '.landing',
  skip: '.landing-skip',
  use: '.landing-use'
};

total = assets.length;

ask = function() {
  dom.landing.classList.add('landing-grab');
  dom.input.focus();
};

done = function() {
  var body = document.body;

  dom.landing.classList.add('landing-open');

  assets.forEach(function(asset, index) {
    var script;

    if (!/\.js$/.test(asset)) {
      return;
    }

    script = document.createElement('script');
    script.textContent = data[index];

    body.appendChild(script);
  });
};

error = function() {
  dom.go.disabled = false;
  dom.input.classList.add('landing-error');
  dom.input.disabled = false;
  dom.input.focus();
  dom.input.select();
};

grab = function(event) {
  var username = dom.input.value.trim(),
      xhr;

  if (dom.input.classList.contains('landing-error')) {
    dom.input.classList.remove('landing-error');
  }

  if (event.which !== 13 || (event.which === 13 && username.length === 0)) {
    return;
  }

  dom.go.disabled = true;
  dom.input.disabled = true;

  xhr = new XMLHttpRequest();

  xhr.addEventListener('error', error);
  xhr.addEventListener('load', parse.bind(this, xhr));

  xhr.open('GET', 'https://api.github.com/users/' + username);
  xhr.send();
};

kickoff = function() {
  dom.go = document.querySelector(dom.go);
  dom.input = document.querySelector(dom.input);
  dom.landing = document.querySelector(dom.landing);
  dom.skip = document.querySelector(dom.skip);
  dom.use = document.querySelector(dom.use);

  dom.go.addEventListener('click', grab.bind(this, { which: 13 }));
  dom.input.addEventListener('keyup', grab);
  dom.skip.addEventListener('click', start);
  dom.use.addEventListener('click', ask);

  load();
};

load = function(pxhr) {
  var asset = assets[index],
      xhr = new XMLHttpRequest();

  if (pxhr && 'response' in pxhr) {
    data[index - 1] = pxhr.response;
  }

  if (index === total) {
    return done();
  }

  index++;

  xhr.addEventListener('progress', progress);
  xhr.addEventListener('load', load.bind(this, xhr));

  xhr.open('GET', asset);
  xhr.send();
};

parse = function(xhr) {
  var data;

  if (xhr.status !== 200) {
    return error();
  }

  try {
    data = JSON.parse(xhr.response);
  } catch (fail) {
    return error();
  }

  // if (data.type.toLowerCase() !== 'user') {
  //   return error();
  // }

  start(data);
};

progress = function(event) {
  var ratio;

  if (!event.total) {
    return;
  }

  ratio = ((index - 1) + (event.loaded / event.total)) / total;
  dom.landing.style.right = ((1 - ratio) * 100).toFixed(5) + '%';
};

reset = function() {
  dom.landing.classList.add('landing-hidden');
  dom.landing.classList.remove('landing-close');
  dom.landing.classList.remove('landing-grab');
  dom.landing.classList.remove('landing-open');
};

start = function(data) {
  window.Game.initialize(window.Phaser, data);
  window.setTimeout(reset, 400);

  dom.landing.classList.add('landing-close');
};

window.addEventListener('load', kickoff);

},{}]},{},[1]);
