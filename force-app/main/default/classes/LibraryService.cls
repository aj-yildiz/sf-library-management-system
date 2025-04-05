
/**
 * Service class for Library Management operations
 */
public with sharing class LibraryService {
    
    /**
     * Checks out a book to a member
     * @param bookId - The ID of the book to checkout
     * @param memberId - The ID of the member checking out the book
     * @param daysToReturn - Number of days allowed before book is due
     * @return Transaction__c - The created transaction record
     */
    public static Transaction__c checkoutBook(Id bookId, Id memberId, Integer daysToReturn) {
        // Validate inputs
        Book__c book = [SELECT Id, Status__c FROM Book__c WHERE Id = :bookId LIMIT 1];
        Member__c member = [SELECT Id, Status__c FROM Member__c WHERE Id = :memberId LIMIT 1];
        
        // Check if book is available
        if (book.Status__c != 'Available') {
            throw new LibraryException('Book is not available for checkout.');
        }
        
        // Check if member is active
        if (member.Status__c != 'Active') {
            throw new LibraryException('Member is not active and cannot checkout books.');
        }
        
        // Update book status
        book.Status__c = 'Checked Out';
        update book;
        
        // Create transaction
        Transaction__c transaction = new Transaction__c(
            Book__c = bookId,
            Member__c = memberId,
            CheckoutDate__c = Datetime.now(),
            DueDate__c = Datetime.now().addDays(daysToReturn),
            Status__c = 'Active'
        );
        
        insert transaction;
        return transaction;
    }
    
    /**
     * Returns a book that was checked out
     * @param transactionId - The ID of the transaction to complete
     * @return Transaction__c - The updated transaction record
     */
    public static Transaction__c returnBook(Id transactionId) {
        Transaction__c transaction = [
            SELECT Id, Book__c, Status__c, ReturnDate__c 
            FROM Transaction__c 
            WHERE Id = :transactionId LIMIT 1
        ];
        
        // Check if transaction is active
        if (transaction.Status__c != 'Active' && transaction.Status__c != 'Overdue') {
            throw new LibraryException('This transaction is already completed.');
        }
        
        // Update book status
        Book__c book = [SELECT Id FROM Book__c WHERE Id = :transaction.Book__c LIMIT 1];
        book.Status__c = 'Available';
        update book;
        
        // Update transaction
        transaction.Status__c = 'Completed';
        transaction.ReturnDate__c = Datetime.now();
        update transaction;
        
        return transaction;
    }
    
    /**
     * Search for books based on various criteria
     * @param searchTerm - Term to search in title, author, and ISBN
     * @param genre - Specific genre to filter by (optional)
     * @param availableOnly - Whether to show only available books
     * @return List<Book__c> - Books matching the search criteria
     */
    public static List<Book__c> searchBooks(String searchTerm, String genre, Boolean availableOnly) {
        String query = 'SELECT Id, Title__c, Author__c, ISBN__c, Genre__c, Status__c, Description__c ';
        query += 'FROM Book__c WHERE ';
        
        // Add search term condition if provided
        if (String.isNotBlank(searchTerm)) {
            String likeParam = '%' + searchTerm + '%';
            query += '(Title__c LIKE :likeParam OR Author__c LIKE :likeParam OR ISBN__c LIKE :likeParam) ';
        } else {
            query += 'Id != null ';
        }
        
        // Add genre filter if provided
        if (String.isNotBlank(genre) && genre != 'All Genres') {
            query += 'AND Genre__c = :genre ';
        }
        
        // Add availability filter if requested
        if (availableOnly) {
            query += 'AND Status__c = \'Available\' ';
        }
        
        query += 'ORDER BY Title__c ASC LIMIT 1000';
        
        return Database.query(query);
    }
    
    /**
     * Check for overdue books and update their status
     * @return Integer - Number of transactions marked as overdue
     */
    public static Integer updateOverdueTransactions() {
        List<Transaction__c> overdueTransactions = [
            SELECT Id, Status__c
            FROM Transaction__c
            WHERE Status__c = 'Active'
            AND DueDate__c < :Datetime.now()
        ];
        
        for (Transaction__c transaction : overdueTransactions) {
            transaction.Status__c = 'Overdue';
        }
        
        if (!overdueTransactions.isEmpty()) {
            update overdueTransactions;
        }
        
        return overdueTransactions.size();
    }
    
    public class LibraryException extends Exception {}
}
