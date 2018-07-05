---
title: Swiper slider 여러개 사용하기
subTitle: 스와이퍼 슬라이더를 여러개 사용해보자
cover: swiper.jpg
category: "Snippet"
---

개인적으로 가장 모던하고 편한 슬라이더는 Swiper 라고 생각한다.  
Swiper 슬라이더를 한페이지에 여러개 사용하고, 하나의 스크립트로 처리할때 유용한 스니펫.
  


~~~javascript
$(".swiper-container").each(function(index, element){
    var $this = $(this);
    $this.addClass('instance-' + index);

    var swiper = new Swiper('.instance-' + index, {
        observer: true,
        observeParents: true,
        slidesPerView : 5,
        navigation: {
            nextEl: $('.instance-' + index).siblings('.swiper-button-next'),
            prevEl: $('.instance-' + index).siblings('.swiper-button-prev'),
        },
        scrollbar: {
            el: $('.instance-' + index).siblings('.swiper-scrollbar'),
            hide: false,
        },
        watchOverflow: true
    });
});
~~~