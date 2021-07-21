jQuery(document).ready(function ($) {
  var animationDelay = 2500,
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000,
    lettersDelay = 50,
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    revealDuration = 600,
    revealAnimationDelay = 1500;

  initHeadline();

  function initHeadline() {
    singleLetters($(".cd-headline.letters").find("b"));
    animateHeadline($(".cd-headline"));
  }

  function singleLetters($words) {
    $words.each(function () {
      var word = $(this),
        letters = word.text().split(""),
        selected = word.hasClass("is-visible");
      for (i in letters) {
        if (word.parents(".rotate-2").length > 0)
          letters[i] = "<em>" + letters[i] + "</em>";
        letters[i] = selected
          ? '<i class="in">' + letters[i] + "</i>"
          : "<i>" + letters[i] + "</i>";
      }
      var newLetters = letters.join("");
      word.html(newLetters).css("opacity", 1);
    });
  }

  function animateHeadline($headlines) {
    var duration = animationDelay;
    $headlines.each(function () {
      var headline = $(this);

      if (headline.hasClass("loading-bar")) {
        duration = barAnimationDelay;
        setTimeout(function () {
          headline.find(".cd-words-wrapper").addClass("is-loading");
        }, barWaiting);
      } else if (headline.hasClass("clip")) {
        var spanWrapper = headline.find(".cd-words-wrapper"),
          newWidth = spanWrapper.width() + 10;
        spanWrapper.css("width", newWidth);
      } else if (!headline.hasClass("type")) {
        var words = headline.find(".cd-words-wrapper b"),
          width = 0;
        words.each(function () {
          var wordWidth = $(this).width();
          if (wordWidth > width) width = wordWidth;
        });
        headline.find(".cd-words-wrapper").css("width", width);
      }

      setTimeout(function () {
        hideWord(headline.find(".is-visible").eq(0));
      }, duration);
    });
  }

  function hideWord($word) {
    var nextWord = takeNext($word);

    if ($word.parents(".cd-headline").hasClass("type")) {
      var parentSpan = $word.parent(".cd-words-wrapper");
      parentSpan.addClass("selected").removeClass("waiting");
      setTimeout(function () {
        parentSpan.removeClass("selected");
        $word
          .removeClass("is-visible")
          .addClass("is-hidden")
          .children("i")
          .removeClass("in")
          .addClass("out");
      }, selectionDuration);
      setTimeout(function () {
        showWord(nextWord, typeLettersDelay);
      }, typeAnimationDelay);
    } else if ($word.parents(".cd-headline").hasClass("letters")) {
      var bool =
        $word.children("i").length >= nextWord.children("i").length
          ? true
          : false;
      hideLetter($word.find("i").eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find("i").eq(0), nextWord, bool, lettersDelay);
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word.parents(".cd-words-wrapper").animate(
        {
          width: "2px",
        },
        revealDuration,
        function () {
          switchWord($word, nextWord);
          showWord(nextWord);
        }
      );
    } else if ($word.parents(".cd-headline").hasClass("loading-bar")) {
      $word.parents(".cd-words-wrapper").removeClass("is-loading");
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, barAnimationDelay);
      setTimeout(function () {
        $word.parents(".cd-words-wrapper").addClass("is-loading");
      }, barWaiting);
    } else {
      switchWord($word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, animationDelay);
    }
  }

  function showWord($word, $duration) {
    if ($word.parents(".cd-headline").hasClass("type")) {
      showLetter($word.find("i").eq(0), $word, false, $duration);
      $word.addClass("is-visible").removeClass("is-hidden");
    } else if ($word.parents(".cd-headline").hasClass("clip")) {
      $word.parents(".cd-words-wrapper").animate(
        {
          width: $word.width() + 10,
        },
        revealDuration,
        function () {
          setTimeout(function () {
            hideWord($word);
          }, revealAnimationDelay);
        }
      );
    }
  }

  function hideLetter($letter, $word, $bool, $duration) {
    $letter.removeClass("in").addClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        hideLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else if ($bool) {
      setTimeout(function () {
        hideWord(takeNext($word));
      }, animationDelay);
    }

    if ($letter.is(":last-child") && $("html").hasClass("no-csstransitions")) {
      var nextWord = takeNext($word);
      switchWord($word, nextWord);
    }
  }

  function showLetter($letter, $word, $bool, $duration) {
    $letter.addClass("in").removeClass("out");

    if (!$letter.is(":last-child")) {
      setTimeout(function () {
        showLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else {
      if ($word.parents(".cd-headline").hasClass("type")) {
        setTimeout(function () {
          $word.parents(".cd-words-wrapper").addClass("waiting");
        }, 200);
      }
      if (!$bool) {
        setTimeout(function () {
          hideWord($word);
        }, animationDelay);
      }
    }
  }

  function takeNext($word) {
    return !$word.is(":last-child")
      ? $word.next()
      : $word.parent().children().eq(0);
  }

  function takePrev($word) {
    return !$word.is(":first-child")
      ? $word.prev()
      : $word.parent().children().last();
  }

  function switchWord($oldWord, $newWord) {
    $oldWord.removeClass("is-visible").addClass("is-hidden");
    $newWord.removeClass("is-hidden").addClass("is-visible");
  }
});

// Init AOS
(function ($) {
  "use strict";

  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }
  $(window).on("load", function () {
    aos_init();
  });
})(jQuery);

$(function () {
  let nav = $("#nav, #nav_toggle"),
    introH = $("#intro").innerHeight(),
    scrollOffset = $(window).scrollTop();

  // ! Fixed header
  checkScroll(scrollOffset);
  $(window).on("scroll", function () {
    scrollOffset = $(this).scrollTop();
    checkScroll(scrollOffset);
  });

  function checkScroll(scrollOffset) {
    if (scrollOffset >= introH) {
      nav.addClass("fixed");
    } else nav.removeClass("fixed");
  }
});

//  Menu nav toggle
$("#nav_toggle").on("click", function (event) {
  event.preventDefault();
  $(this).toggleClass("active");
  $("#nav").toggleClass("active");
});

// Slick slider
$(function () {
  $(".slick-slider").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    // variableWidth: true,
    // centerMode: true,
    dots: true,
    responsive: [
      {
        breakpoint: 2151,
        settings: {
          slidesToShow: 3,
          variableWidth: true,
          centerMode: true,
          arrows: true,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          arrows: true,
		  variableWidth: true,
		  centerMode: true,
		  adaptiveHeight: true
        },
      },
	  {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          arrows: true,
		  variableWidth: true,
		  centerMode: true,
		  adaptiveHeight: true,
		//   dots: false
        },
      },
    ],
  });
});

// MagnificPopup
$(document).ready(function () {
  $(".news-gallery, .menu-gallery").magnificPopup({
    type: "image",
    delegate: "a",
    gallery: {
      enabled: true,
    },
  });
});

// Cart
let count = 0;
$(".cart-btn").on("click", function () {
  let cart = $(".cart-nav");
  let imgtodrag = $(this)
    .parent(".buttons")
    .parent(".content")
    .parent(".card")
    .find("img")
    .eq(0);
  if (imgtodrag) {
    let imgclone = imgtodrag
      .clone()
      .offset({
        top: imgtodrag.offset().top,
        left: imgtodrag.offset().left,
      })
      .appendTo($("body"))
      .animate(
        {
          top: cart.offset().top + 20,
          left: cart.offset().left + 30,
          width: 75,
          height: 75,
        },
        1000,
        "easeInOutExpo"
      );

    setTimeout(function () {
      count++;
      $(".cart-nav .item-count").text(count);
    }, 500);
    imgclone.animate(
      {
        width: 0,
        height: 0,
      },
      function () {
        $(this).detach();
      }
    );
  }
});

$(".cart-btn1").on("click", function () {
  let cart = $(".cart-nav");
  let imgtodrag = $(this)
    .parent(".buttons")
    .parent(".content")
    .parent(".card")
    .find("img")
    .eq(0);
  if (imgtodrag) {
    let imgclone = imgtodrag
      .clone()
      .offset({
        top: imgtodrag.offset().top,
        left: imgtodrag.offset().left,
      })
      .appendTo($("body"))
      .animate(
        {
          top: cart.offset().top + 20,
          left: cart.offset().left + 30,
          width: 75,
          height: 75,
        },
        1000,
        "easeInOutExpo"
      );

    setTimeout(function () {
      count--;
      $(".cart-nav .item-count").text(count);
    }, 500);
    imgclone.animate(
      {
        width: 0,
        height: 0,
      },
      function () {
        $(this).detach();
      }
    );
  }
});

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});
