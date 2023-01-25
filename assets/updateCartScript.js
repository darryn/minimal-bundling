// updateCartScript.js
window.addEventListener('DOMContentLoaded', (e)=> {
    initBundleRemoveButtons()

    initBundleQuantitySelector()

})

/* Initialize the remove buttons in cart page */
const initBundleRemoveButtons = () => {
    const removeButtons = document.querySelectorAll('.cart__remove')
    removeButtons.forEach( btn => {
        if(btn.dataset.productType=='bundle'){
            // initialize AJAX POST data to cart/update.js
            data = { updates: {
            } } 
            // read out all the variant IDs related to the bundle - for both the bundle itself and the bundle items
            const variantIds = btn.dataset.variants.split(',')
            // build POST data. Reference: https://shopify.dev/docs/themes/ajax-api/reference/cart#post-cart-update-js
            variantIds.forEach( id => {
                data.updates[id] = 0
            })
            // listen to button click event
            btn.addEventListener('click', (e)=> {
                e.preventDefault()
                // make AJAX POST at cart/update.js
                fetch('/cart/update.js',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then( res => res.json())
                .then( json => {
                    // redirect user to cart
                    window.location.href='/cart'
                })
                .catch( error => {
                    console.log('Error: ', error)
                } )
            })
        }
    })
}


/* Initialize the quantity selector in cart for bundle */
const initBundleQuantitySelector = () => {
    const bundleQuantitySelectors = document.querySelectorAll('input.cart__quantity-selector.bundle-quantity')
    bundleQuantitySelectors.forEach( bundleQuantitySelector => {
        let bundleId = bundleQuantitySelector.dataset.bundleId
        bundleQuantitySelector.addEventListener('change', (e)=>{
            // read out the up-to-date quantity of the bundle selected by the user in cart
            let bundleQuantity = e.target.value
            // Select the items belonging to the same bundle
            const bundleItemQuantitySelectors = [...document.querySelectorAll('input.cart__quantity-selector.bundle-item-quantity')].filter( selector => selector.dataset.bundleId == bundleId )
            // Sync the items' quantity with the same bundle quantity
            bundleItemQuantitySelectors.forEach( bundleItemQuantitySelector => {
                bundleItemQuantitySelector.value = bundleQuantity
            })
        })
    })
}