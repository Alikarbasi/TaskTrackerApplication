//  set today's date as the default value for the date picker 

    // Function to format a number as two digits
    function formatTwoDigits(number) {
        return number < 10 ? '0' + number : number;
    };

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = formatTwoDigits(currentDate.getMonth() + 1);
    const day = formatTwoDigits(currentDate.getDate());
    const today = `${year}-${month}-${day}`;

    // Set the default value for the date input
    document.getElementById('date').defaultValue = today;