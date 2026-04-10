(function () {
    var storageKey = 'theme-preference';
    var root = document.documentElement;
    var button = document.querySelector('.theme-toggle');
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getSystemTheme() {
        return mediaQuery.matches ? 'dark' : 'light';
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            // Ignore storage failures.
        }
    }

    function updateButton(theme) {
        if (!button) {
            return;
        }

        var nextTheme = theme === 'dark' ? 'light' : 'dark';
        var value = button.querySelector('.theme-toggle__value');

        if (value) {
            value.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }

        button.setAttribute('data-theme-current', theme);
        button.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
        button.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    function applyTheme(theme, persist) {
        root.setAttribute('data-theme', theme);

        if (persist) {
            setStoredTheme(theme);
        }

        updateButton(theme);
    }

    function resolveInitialTheme() {
        return getStoredTheme() || root.getAttribute('data-theme') || getSystemTheme();
    }

    function handlePreferenceChange(event) {
        if (getStoredTheme()) {
            return;
        }

        applyTheme(event.matches ? 'dark' : 'light', false);
    }

    root.classList.remove('no-js');
    applyTheme(resolveInitialTheme(), false);

    if (button) {
        button.addEventListener('click', function () {
            var currentTheme = root.getAttribute('data-theme') || getSystemTheme();
            var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme, true);
        });
    }

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handlePreferenceChange);
    } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handlePreferenceChange);
    }
}());
