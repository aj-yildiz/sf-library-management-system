
import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBooksByStatus from '@salesforce/apex/LibraryDashboardController.getBooksByStatus';
import getRecentTransactions from '@salesforce/apex/LibraryDashboardController.getRecentTransactions';
import getOverdueBooks from '@salesforce/apex/LibraryDashboardController.getOverdueBooks';

export default class LibraryDashboard extends LightningElement {
    @track loading = true;
    @track booksByStatus = [];
    @track recentTransactions = [];
    @track overdueBooks = [];
    @track error;
    
    // Load dashboard data
    connectedCallback() {
        this.loadDashboardData();
    }
    
    loadDashboardData() {
        this.loading = true;
        
        // Use Promise.all to load all data in parallel
        Promise.all([
            this.loadBooksByStatus(),
            this.loadRecentTransactions(),
            this.loadOverdueBooks()
        ])
        .then(() => {
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.showToast('Error', 'Failed to load dashboard data: ' + error.body.message, 'error');
        })
        .finally(() => {
            this.loading = false;
        });
    }
    
    loadBooksByStatus() {
        return getBooksByStatus()
            .then(result => {
                this.booksByStatus = result;
            });
    }
    
    loadRecentTransactions() {
        return getRecentTransactions()
            .then(result => {
                this.recentTransactions = result;
            });
    }
    
    loadOverdueBooks() {
        return getOverdueBooks()
            .then(result => {
                this.overdueBooks = result;
            });
    }
    
    handleRefresh() {
        this.loadDashboardData();
    }
    
    showToast(title, message, variant) {
        const toast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toast);
    }
    
    get hasOverdueBooks() {
        return this.overdueBooks && this.overdueBooks.length > 0;
    }
    
    get hasRecentTransactions() {
        return this.recentTransactions && this.recentTransactions.length > 0;
    }
}
