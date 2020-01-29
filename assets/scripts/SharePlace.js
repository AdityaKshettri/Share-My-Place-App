// import {Modal} from './Modal.js';
// import {Map} from './Map.js';
// import {getCoordsFromAddress, getAddressFromCoords} from './Location.js';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');
        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
        this.shareBtn.addEventListener('click', this.sharePlaceHandler);
        addressForm.addEventListener('submit', this.findAddressHandler);
    }

    sharePlaceHandler() {
        const shareLinkInputElement = document.getElementById('share-link');
        if(!navigator.clipboard) {
            shareLinkInputElement.select();
            return;
        }
        navigator.clipboard.writeText(shareLinkInputElement.value)
        .then(() => {
            alert('Copied to Clipboard');
        })
        .catch(() => {
            console.log(error);
            shareLinkInputElement.select();
        });
    }

    selectPlace(coordinates, address) {
        if(this.map) {
            this.map.render(coordinates);
        }
        else {
            this.map = new Map(coordinates);
        }
        this.shareBtn.disabled = false;
        const shareLinkInputElement = document.getElementById('share-link');
        shareLinkInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

    locateUserHandler() {
        if(!navigator.geolocation) {
            alert('Location feature is not available in your browser - use a modern browser or enter the address manually');
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading Location - please wait!!');
        modal.show();
        navigator.geolocation.getCurrentPosition(
            async successResult => {
                modal.hide();
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                };
                const address = await getAddressFromCoords(coordinates);
                modal.hide();
                this.selectPlace(coordinates, address);
            },
            error => {
                modal.hide();
                alert('Could not locate you unfortunately - please enter an address manually');
            }
        );
    }

    async findAddressHandler() {
        event.preventDefault();
        const address = event.target.querySelector('input');
        if(!address) {
            alert("Invalid address!");
            return;
        }
        const modal = new Modal('loading-modal-content', 'Loading Location - please wait!!');
        modal.show();
        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch(err) {
            alert(err.message);
        }
        modal.hide();
    }
}

const placeFinder = new PlaceFinder();