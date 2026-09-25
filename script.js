(function () {
    // Допустимые символы для каждого типа поля
    const patterns = {
        text: /[a-zA-Zа-яА-ЯёЁ\s\-]/,
        email: /[a-zA-Z0-9.@\-_]/,
        phone: /[0-9\+\(\)\-\s]/,
        number: /[0-9\.\,\-]/
    };

    /**
     * Удаляет все символы, кроме допустимых
     */
    function removeInvalidChars(value, type) {
        const pattern = patterns[type];
        if (!pattern) return value;
        return value
            .split('')
            .filter(function (ch) {
                return pattern.test(ch) || ch === ' ';
            })
            .join('');
    }

    /**
     * Заменяет несколько идущих подряд пробелов или дефисов на один
     */
    function collapseSpacesAndDashes(value) {
        return value
            .replace(/[\s\-]{2,}/g, '-')
            .replace(/\s+/g, ' ');
    }

    /**
     * Удаляет пробелы и дефисы в начале и конце
     */
    function trimSpacesAndDashes(value) {
        return value.replace(/^[\s\-]+|[\s\-]+$/g, '');
    }

    /**
     * Приводит первую букву каждого слова к верхнему регисту, остальные — к нижнему
     */
    function capitalizeWords(value) {
        return value
            .toLowerCase()
            .replace(/\b\w/g, function (ch) {
                return ch.toUpperCase();
            });
    }

    /**
     * Основная функция валидации
     */
    function validateField(value, type) {
        // 1. Удаляем недопустимые символы
        let result = removeInvalidChars(value, type);

        // 2. Сжимаем множественные пробелы и дефисы
        result = collapseSpacesAndDashes(result);

        // 3. Удаляем пробелы и дефисы в начале и конце
        result = trimSpacesAndDashes(result);

        // 4. Для type=text — капитализация слов
        if (type === 'text') {
            result = capitalizeWords(result);
        }

        return result;
    }

    /**
     * Навешиваем обработчики blur на все поля
     */
    function attachBlurHandlers() {
        var inputs = document.querySelectorAll('input[data-type]');

        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                var type = this.getAttribute('data-type');
                var originalValue = this.value;
                var correctedValue = validateField(originalValue, type);

                if (originalValue !== correctedValue) {
                    this.value = correctedValue;
                }
            });
        });
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', attachBlurHandlers);
})();
