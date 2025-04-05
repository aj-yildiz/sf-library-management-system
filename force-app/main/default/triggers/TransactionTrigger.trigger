
/**
 * Trigger on Transaction__c to handle related automation
 */
trigger TransactionTrigger on Transaction__c (after insert, after update, before insert, before update) {
    // Before insert logic
    if (Trigger.isBefore && Trigger.isInsert) {
        // Validate transactions before creation
        for (Transaction__c transaction : Trigger.new) {
            // Set default values or validation logic here if needed
        }
    }
    
    // After insert logic
    if (Trigger.isAfter && Trigger.isInsert) {
        // Process new transactions
        List<Id> bookIds = new List<Id>();
        Map<Id, Id> bookToMemberMap = new Map<Id, Id>();
        
        for (Transaction__c transaction : Trigger.new) {
            bookIds.add(transaction.Book__c);
            bookToMemberMap.put(transaction.Book__c, transaction.Member__c);
        }
        
        // Send checkout confirmations if applicable
        if (!bookIds.isEmpty()) {
            // Logic for sending confirmation emails could be added here
        }
    }
    
    // Before update logic
    if (Trigger.isBefore && Trigger.isUpdate) {
        // Validate transaction updates
        for (Transaction__c transaction : Trigger.new) {
            Transaction__c oldTransaction = Trigger.oldMap.get(transaction.Id);
            
            // Prevent changing book or member after creation
            if (transaction.Book__c != oldTransaction.Book__c || 
                transaction.Member__c != oldTransaction.Member__c) {
                transaction.addError('Cannot change the book or member on an existing transaction.');
            }
        }
    }
    
    // After update logic
    if (Trigger.isAfter && Trigger.isUpdate) {
        List<Transaction__c> completedTransactions = new List<Transaction__c>();
        List<Transaction__c> overdueTransactions = new List<Transaction__c>();
        
        for (Transaction__c transaction : Trigger.new) {
            Transaction__c oldTransaction = Trigger.oldMap.get(transaction.Id);
            
            // Identify newly completed transactions
            if (transaction.Status__c == 'Completed' && oldTransaction.Status__c != 'Completed') {
                completedTransactions.add(transaction);
            }
            
            // Identify newly overdue transactions
            if (transaction.Status__c == 'Overdue' && oldTransaction.Status__c != 'Overdue') {
                overdueTransactions.add(transaction);
            }
        }
        
        // Process completed transactions
        if (!completedTransactions.isEmpty()) {
            // Logic for handling completed transactions could be added here
            // e.g., send return confirmation emails
        }
        
        // Process overdue transactions
        if (!overdueTransactions.isEmpty()) {
            // Logic for handling overdue transactions could be added here
            // e.g., send overdue notifications
        }
    }
}
