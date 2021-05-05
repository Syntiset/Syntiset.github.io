(function ($) {
    $.fn.quicksand = function (collection, customOptions) {     
        var options = {
            duration: 750,
            easing: 'swing',
            attribute: 'data-id', // атрибут для распознавания одинаковых элементов в источнике и dest
            adjustHeight: 'auto', // 'dynamic' анимирует высоту во время перетасовки (межденно), 'auto' настраивает ее до или после анимации, ложная высота уезда постоянна
            useScaling: true, // вырубить, если не использую масштабирующий эффект или нужно повысить производительность
            enhancement: function(c) {}, // функция визуального улучшения (например, замена шрифта) для клонированных элементов
            selector: '> *',
            dx: 0,
            dy: 0
        };
        $.extend(options, customOptions);
        
        if ($.browser.msie || (typeof($.fn.scale) == 'undefined')) {
            // юзаешь IE и хочешь получить эффект прокрутки? Хер с маслом.
            options.useScaling = false;
        }
        
        var callbackFunction;
        if (typeof(arguments[1]) == 'function') {
            var callbackFunction = arguments[1];
        } else if (typeof(arguments[2] == 'function')) {
            var callbackFunction = arguments[2];
        }
    
        
        return this.each(function (i) {
            var val;
            var animationQueue = []; // юзается для хранения всех параметров анимации перед началом анимации; решает начальные замедления анимации
            var $collection = $(collection).clone(); // целевой (выборочный) сбор
            var $sourceParent = $(this); // источник, видимый контейнер исходного сбора
            var sourceHeight = $(this).css('height'); // юзается для поддержания высоты и передвижения документов во время анимации
            
            var destHeight;
            var adjustHeightOnCallback = false;
            
            var offset = $($sourceParent).offset(); // смещение видимого контейнера, используемого в расчетах анимации
            var offsets = [];       
            
            var $source = $(this).find(options.selector);
            
            // замените коллекцию и закрыть, если в колледже используется IE6
            if ($.browser.msie && $.browser.version.substr(0,1)<7) {
                $sourceParent.html('').append($collection);
                return;
            }

            // получает вызов при завершении анимации
            var postCallbackPerformed = 0; // предотвращает вызов функции более одного раза
            var postCallback = function () {
                if (!postCallbackPerformed) {
                    $sourceParent.html($dest.html()); // помещённый целевой HTML в видимый исходный контейнер 
                    if (typeof callbackFunction == 'function') {
                        callbackFunction.call(this);
                    }
                    if (adjustHeightOnCallback) {
                        $sourceParent.css('height', destHeight);
                    }
                    options.enhancement($sourceParent); // выполнение пользовательских визуальных улучшений
                    postCallbackPerformed = 1;
                }
            };
            
            var $correctionParent = $sourceParent.offsetParent();
            var correctionOffset = $correctionParent.offset();
            if ($correctionParent.css('position') == 'relative') {
                if ($correctionParent.get(0).nodeName.toLowerCase() == 'body') {

                } else {
                    correctionOffset.top += parseFloat($correctionParent.css('border-top-width'));
                    correctionOffset.left += parseFloat($correctionParent.css('border-left-width'));
                }
            } else {
                correctionOffset.top -= parseFloat($correctionParent.css('border-top-width'));
                correctionOffset.left -= parseFloat($correctionParent.css('border-left-width'));
                correctionOffset.top -= parseFloat($correctionParent.css('margin-top'));
                correctionOffset.left -= parseFloat($correctionParent.css('margin-left'));
            }
            
            if (isNaN(correctionOffset.left)) {
                correctionOffset.left = 0;
            }
            if (isNaN(correctionOffset.top)) {
                correctionOffset.top = 0;
            }
            
            correctionOffset.left -= options.dx;
            correctionOffset.top -= options.dy;

            $sourceParent.css('height', $(this).height());
            
            $source.each(function (i) {
                offsets[i] = $(this).offset();
            });
            
            $(this).stop();
            var dx = 0; var dy = 0;
            $source.each(function (i) {
                $(this).stop();
                var rawObj = $(this).get(0);
                if (rawObj.style.position == 'absolute') {
                    dx = -options.dx;
                    dy = -options.dy;
                } else {
                    dx = options.dx;
                    dy = options.dy;                    
                }

                rawObj.style.position = 'absolute';
                rawObj.style.margin = '0';

                rawObj.style.top = (offsets[i].top - parseFloat(rawObj.style.marginTop) - correctionOffset.top + dy) + 'px';
                rawObj.style.left = (offsets[i].left - parseFloat(rawObj.style.marginLeft) - correctionOffset.left + dx) + 'px';
            });
                    
            var $dest = $($sourceParent).clone();
            var rawDest = $dest.get(0);
            rawDest.innerHTML = '';
            rawDest.setAttribute('id', '');
            rawDest.style.height = 'auto';
            rawDest.style.width = $sourceParent.width() + 'px';
            $dest.append($collection);      
            $dest.insertBefore($sourceParent);
            $dest.css('opacity', 0.0);
            rawDest.style.zIndex = -1;
            
            rawDest.style.margin = '0';
            rawDest.style.position = 'absolute';
            rawDest.style.top = offset.top - correctionOffset.top + 'px';
            rawDest.style.left = offset.left - correctionOffset.left + 'px';
            
            
    
            

            if (options.adjustHeight === 'dynamic') {
                $sourceParent.animate({height: $dest.height()}, options.duration, options.easing);
            } else if (options.adjustHeight === 'auto') {
                destHeight = $dest.height();
                if (parseFloat(sourceHeight) < parseFloat(destHeight)) {
                    // тут регулировка высоты, дабы предметы не выходили из контейнера
                    $sourceParent.css('height', destHeight);
                } else {
                    //  запоздалая корректировка при обратном вызове
                    adjustHeightOnCallback = true;
                }
            }
                 
            $source.each(function (i) {
                var destElement = [];
                if (typeof(options.attribute) == 'function') {
                    
                    val = options.attribute($(this));
                    $collection.each(function() {
                        if (options.attribute(this) == val) {
                            destElement = $(this);
                            return false;
                        }
                    });
                } else {
                    destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                }
                if (destElement.length) {
                    if (!options.useScaling) {
                        animationQueue.push(
                                            {
                                                element: $(this), 
                                                animation: 
                                                    {top: destElement.offset().top - correctionOffset.top, 
                                                     left: destElement.offset().left - correctionOffset.left, 
                                                     opacity: 1.0
                                                    }
                                            });

                    } else {
                        animationQueue.push({
                                            element: $(this), 
                                            animation: {top: destElement.offset().top - correctionOffset.top, 
                                                        left: destElement.offset().left - correctionOffset.left, 
                                                        opacity: 1.0, 
                                                        scale: '1.0'
                                                       }
                                            });

                    }
                } else {
                    if (!options.useScaling) {
                        animationQueue.push({element: $(this), 
                                             animation: {opacity: '0.0'}});
                    } else {
                        animationQueue.push({element: $(this), animation: {opacity: '0.0', 
                                         scale: '0.0'}});
                    }
                }
            });
            
            $collection.each(function (i) {
                
                var sourceElement = [];
                var destElement = [];
                if (typeof(options.attribute) == 'function') {
                    val = options.attribute($(this));
                    $source.each(function() {
                        if (options.attribute(this) == val) {
                            sourceElement = $(this);
                            return false;
                        }
                    });                 

                    $collection.each(function() {
                        if (options.attribute(this) == val) {
                            destElement = $(this);
                            return false;
                        }
                    });
                } else {
                    sourceElement = $source.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                    destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                }
                
                var animationOptions;
                if (sourceElement.length === 0) {
                    if (!options.useScaling) {
                        animationOptions = {
                            opacity: '1.0'
                        };
                    } else {
                        animationOptions = {
                            opacity: '1.0',
                            scale: '1.0'
                        };
                    }
                    d = destElement.clone();
                    var rawDestElement = d.get(0);
                    rawDestElement.style.position = 'absolute';
                    rawDestElement.style.margin = '0';
                    rawDestElement.style.top = destElement.offset().top - correctionOffset.top + 'px';
                    rawDestElement.style.left = destElement.offset().left - correctionOffset.left + 'px';
                    d.css('opacity', 0.0); // IE
                    if (options.useScaling) {
                        d.css('transform', 'scale(0.0)');
                    }
                    d.appendTo($sourceParent);
                    
                    animationQueue.push({element: $(d), 
                                         animation: animationOptions});
                }
            });
            
            $dest.remove();
            options.enhancement($sourceParent); // выполнение пользовательских визуальных улучшений во время анимации
            for (i = 0; i < animationQueue.length; i++) {
                animationQueue[i].element.animate(animationQueue[i].animation, options.duration, options.easing, postCallback);
            }
        });
    };
})(jQuery);