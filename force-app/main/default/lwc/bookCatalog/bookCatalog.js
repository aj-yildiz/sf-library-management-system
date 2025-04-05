
import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchBooks from '@salesforce/apex/LibraryService.searchBooks';

export default class BookCatalog extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track selectedGenre = '';
    @track availableOnly = false;
    @track books = [];
    @track loading = false;
    @track error;
    
    genreOptions = [
        { label: 'All Genres', value: '' },
        { label: 'Fiction', value: 'Fiction' },
        { label: 'Non-Fiction', value: 'Non-Fiction' },
        { label: 'Science Fiction', value: 'Science Fiction' },
        { label: 'Mystery', value: 'Mystery' },
        { label: 'Biography', value: 'Biography' },
        { label: 'Self Help', value: 'Self Help' },
        { label: 'Business', value: 'Business' }
    ];
    
    connectedCallback() {
        // Load books on component initialization
        this.loadBooks();
    }
    
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
    }
    
    handleGenreChange(event) {
        this.selectedGenre = event.detail.value;
    }
    
    handleAvailabilityChange(event) {
        this.availableOnly = event.target.checked;
    }
    
    handleSearch() {
        this.loadBooks();
    }
    
    loadBooks() {
        this.loading = true;
        
        searchBooks({
            searchTerm: this.searchTerm,
            genre: this.selectedGenre,
            availableOnly: this.availableOnly
        })
        .then(result => {
            this.books = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.books = [];
            this.showToast('Error', 'Failed to load books: ' + error.body.message, 'error');
        })
        .finally(() => {
            this.loading = false;
        });
    }
    
    handleBookSelection(event) {
        const bookId = event.currentTarget.dataset.id;
        
        // Navigate to book detail page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: bookId,
                objectApiName: 'Book__c',
                actionName: 'view'
            }
        });
    }
    
    showToast(title, message, variant) {
        const toast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toast);
    }
    
    get hasBooks() {
        return this.books && this.books.length > 0;
    }
}
