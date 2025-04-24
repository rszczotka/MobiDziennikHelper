document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refresh-button');
    const averageResults = document.getElementById('average-results');

    // Function to check if we're on the Mobidziennik grades page
    function isOnGradesPage(url) {
        return url && url.includes('mobidziennik.pl/dziennik/oceny');
    }

    // Function to send message to the active tab to refresh grade calculations
    function refreshAverages() {
        // Use browser.tabs for Firefox compatibility
        const tabs = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;
        
        tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && isOnGradesPage(tabs[0].url)) {
                tabs.sendMessage(tabs[0].id, { action: 'calculateAverages' }, (response) => {
                    if (response && response.success) {
                        averageResults.textContent = 'Średnie zostały odświeżone!';
                        averageResults.style.color = 'green';
                        
                        // Clear the message after 3 seconds
                        setTimeout(() => {
                            averageResults.textContent = '';
                        }, 3000);
                    } else {
                        averageResults.textContent = 'Nie można odświeżyć średnich. Upewnij się, że jesteś na stronie z ocenami.';
                        averageResults.style.color = 'red';
                    }
                });
            } else {
                averageResults.textContent = 'Nie jesteś na stronie z ocenami Mobidziennika.';
                averageResults.style.color = 'red';
            }
        });
    }

    // Add click event listener to the refresh button
    refreshButton.addEventListener('click', refreshAverages);
});