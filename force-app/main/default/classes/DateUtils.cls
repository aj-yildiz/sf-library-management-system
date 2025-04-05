
/**
 * Utility class for date operations
 */
public class DateUtils {
    
    /**
     * Calculate the number of days between two dates
     * @param startDate - The start date
     * @param endDate - The end date
     * @return Integer - Number of days between dates
     */
    public static Integer daysBetween(Datetime startDate, Datetime endDate) {
        Long startTime = startDate.getTime();
        Long endTime = endDate.getTime();
        Long millisecondsInDay = 1000 * 60 * 60 * 24;
        
        Integer daysDifference = (Integer)((endTime - startTime) / millisecondsInDay);
        return Math.abs(daysDifference);
    }
    
    /**
     * Format a date as a friendly string
     * @param dt - The datetime to format
     * @return String - Formatted date
     */
    public static String formatDateFriendly(Datetime dt) {
        if (dt == null) return '';
        
        Datetime now = Datetime.now();
        Integer daysDiff = daysBetween(dt, now);
        
        if (daysDiff == 0) {
            return 'Today';
        } else if (daysDiff == 1) {
            return (dt < now) ? 'Yesterday' : 'Tomorrow';
        } else if (daysDiff < 7) {
            return dt.format('EEEE');
        } else {
            return dt.format('MMM d, yyyy');
        }
    }
}
