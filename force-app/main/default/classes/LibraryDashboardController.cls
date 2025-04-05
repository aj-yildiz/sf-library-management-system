
/**
 * Controller for the Library Dashboard
 */
public with sharing class LibraryDashboardController {
    
    /**
     * Get count of books by status
     * @return List<Object> - Data formatted for charts
     */
    @AuraEnabled(cacheable=true)
    public static List<Object> getBooksByStatus() {
        List<Object> result = new List<Object>();
        
        // Query for book counts by status
        AggregateResult[] groupedResults = [
            SELECT Status__c, COUNT(Id) bookCount
            FROM Book__c
            GROUP BY Status__c
        ];
        
        // Format data for charts
        for (AggregateResult ar : groupedResults) {
            String status = (String)ar.get('Status__c');
            Integer count = (Integer)ar.get('bookCount');
            
            Map<String, Object> dataPoint = new Map<String, Object>();
            dataPoint.put('label', status);
            dataPoint.put('value', count);
            
            // Assign colors based on status
            if (status == 'Available') {
                dataPoint.put('color', '#4caf50');
            } else if (status == 'Checked Out') {
                dataPoint.put('color', '#ff9800');
            } else if (status == 'Reserved') {
                dataPoint.put('color', '#2196f3');
            } else {
                dataPoint.put('color', '#9e9e9e');
            }
            
            result.add(dataPoint);
        }
        
        return result;
    }
    
    /**
     * Get recent transactions
     * @return List<Map<String, Object>> - Recent transactions
     */
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getRecentTransactions() {
        List<Map<String, Object>> result = new List<Map<String, Object>>();
        
        // Query for recent transactions
        List<Transaction__c> transactions = [
            SELECT Id, Book__r.Title__c, Member__r.Name__c, CheckoutDate__c, DueDate__c, ReturnDate__c, Status__c
            FROM Transaction__c
            ORDER BY CheckoutDate__c DESC
            LIMIT 10
        ];
        
        // Format data for UI
        for (Transaction__c trans : transactions) {
            Map<String, Object> item = new Map<String, Object>();
            item.put('id', trans.Id);
            item.put('bookTitle', trans.Book__r.Title__c);
            item.put('memberName', trans.Member__r.Name__c);
            item.put('checkoutDate', trans.CheckoutDate__c);
            item.put('dueDate', trans.DueDate__c);
            item.put('returnDate', trans.ReturnDate__c);
            item.put('status', trans.Status__c);
            
            result.add(item);
        }
        
        return result;
    }
    
    /**
     * Get overdue books
     * @return List<Map<String, Object>> - Overdue books
     */
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getOverdueBooks() {
        List<Map<String, Object>> result = new List<Map<String, Object>>();
        
        // Query for overdue transactions
        List<Transaction__c> transactions = [
            SELECT Id, Book__r.Title__c, Book__r.Id, Member__r.Name__c, Member__r.Id, 
                   Member__r.Email__c, DueDate__c, CheckoutDate__c
            FROM Transaction__c
            WHERE Status__c = 'Overdue'
            ORDER BY DueDate__c ASC
        ];
        
        // Format data for UI
        for (Transaction__c trans : transactions) {
            Map<String, Object> item = new Map<String, Object>();
            item.put('id', trans.Id);
            item.put('bookId', trans.Book__r.Id);
            item.put('title', trans.Book__r.Title__c);
            item.put('memberId', trans.Member__r.Id);
            item.put('memberName', trans.Member__r.Name__c);
            item.put('memberEmail', trans.Member__r.Email__c);
            item.put('dueDate', trans.DueDate__c.format());
            item.put('daysOverdue', DateUtils.daysBetween(trans.DueDate__c, Datetime.now()));
            
            result.add(item);
        }
        
        return result;
    }
    
    /**
     * Get summary statistics
     * @return Map<String, Object> - Summary statistics
     */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getSummaryStatistics() {
        Map<String, Object> stats = new Map<String, Object>();
        
        // Get total books
        Integer totalBooks = [SELECT COUNT() FROM Book__c];
        stats.put('totalBooks', totalBooks);
        
        // Get total members
        Integer totalMembers = [SELECT COUNT() FROM Member__c WHERE Status__c = 'Active'];
        stats.put('activeMembers', totalMembers);
        
        // Get active checkouts
        Integer activeCheckouts = [SELECT COUNT() FROM Transaction__c WHERE Status__c = 'Active'];
        stats.put('activeCheckouts', activeCheckouts);
        
        // Get overdue books
        Integer overdueBooks = [SELECT COUNT() FROM Transaction__c WHERE Status__c = 'Overdue'];
        stats.put('overdueBooks', overdueBooks);
        
        return stats;
    }
}
