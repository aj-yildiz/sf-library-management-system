
import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkoutBook from '@salesforce/apex/LibraryService.checkoutBook';
import returnBook from '@salesforce/apex/LibraryService.returnBook';
import { refreshApex } from '@salesforce/apex';

import TITLE_FIELD from '@salesforce/schema/Book__c.Title__c';
import AUTHOR_FIELD from '@salesforce/schema/Book__c.Author__c';
import ISBN_FIELD from '@salesforce/schema/Book__c.ISBN__c';
import GENRE_FIELD from '@salesforce/schema/Book__c.Genre__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Book__c.Description__c';
import STATUS_FIELD from '@salesforce/schema/Book__c.Status__c';
import PUBLISHED_YEAR_FIELD from '@salesforce/schema/Book__c.PublishedYear__c';
import LOCATION_FIELD from '@salesforce/schema/Book__c.Location__c';

export default class BookDetail extends LightningElement {
    @api recordId;
    @track loading = false;
    @track checkoutModalOpen = false;
    @track selectedMemberId;
    @track wiredBookResult;
    
    // Get book details
    @wire(getRecord, { 
        recordId: '$recordId', 
        fields: [
            TITLE_FIELD, 
            AUTHOR_FIELD, 
            ISBN_FIELD, 
            GENRE_FIELD,
            DESCRIPTION_FIELD,
            STATUS_FIELD,
            PUBLISHED_YEAR_FIELD,
            LOCATION_FIELD
        ] 
    })
    wiredBook(result) {
        this.wiredBookResult = result;
        if (result.data) {
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.showToast('Error', 'Failed to load book details: ' + result.error.body.message, 'error');
        }
    }
    
    get book() {
        return this.wiredBookResult.data ? this.wiredBookResult.data.fields : null;
    }
    
    get isAvailable() {
        return this.book && this.book.Status__c.value === 'Available';
    }
    
    get isCheckedOut() {
        return this.book && this.book.Status__c.value === 'Checked Out';
    }
    
    // Open checkout modal
    handleCheckout() {
        this.checkoutModalOpen = true;
    }
    
    // Close checkout modal
    closeModal() {
        this.checkoutModalOpen = false;
        this.selectedMemberId = undefined;
    }
    
    // Handle member selection
    handleMemberChange(event) {
        this.selectedMemberId = event.detail.value;
    }
    
    // Process checkout action
    processCheckout() {
        if (!this.selectedMemberId) {
            this.showToast('Error', 'Please select a member', 'error');
            return;
        }
        
        this.loading = true;
        
        checkoutBook({
            bookId: this.recordId,
            memberId: this.selectedMemberId,
            daysToReturn: 14
        })
        .then(() => {
            this.showToast('Success', 'Book checked out successfully', 'success');
            this.closeModal();
            return refreshApex(this.wiredBookResult);
        })
        .catch(error => {
            this.showToast('Error', 'Failed to checkout book: ' + error.body.message, 'error');
        })
        .finally(() => {
            this.loading = false;
        });
    }
    
    // Handle return action
    handleReturn() {
        this.loading = true;
        
        // To return a book we first need to find the active transaction
        returnBook({
            transactionId: this.activeTransactionId
        })
        .then(() => {
            this.showToast('Success', 'Book returned successfully', 'success');
            return refreshApex(this.wiredBookResult);
        })
        .catch(error => {
            this.showToast('Error', 'Failed to return book: ' + error.body.message, 'error');
        })
        .finally(() => {
            this.loading = false;
        });
    }
    
    // Display toast message
    showToast(title, message, variant) {
        const toast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toast);
    }
}
