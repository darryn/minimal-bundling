// addToCartScript.js

window.addEventListener('DOMContentLoaded', (e)=> {
    init()
})

/* initialize */
const init = () => {
    console.log('DOM fully loaded and parsed.')
    // disable add to cart button before users make any selection choice
    enableAddToCart(false)
    /* listen to the change event on all selects */
    document.querySelectorAll('.bundle-select').forEach( elem => {
        elem.addEventListener('change', selectCallback)
    })
    /* attach form submit callback */
    document.querySelector('.product-single form').addEventListener('submit', addToCartCallback)
}

/* enable add to cart button if enable=true; otherwise, disable the button */
const enableAddToCart = (enable) => {
    const btnAddToCart = document.getElementById('AddToCart')     
    btnAddToCart.disabled = !enable
}

/* the callback function to handle select event */
const selectCallback = () => {
    let allSelected = true
    document.querySelectorAll('.bundle-select').forEach( elem => {
        // check whether any select has not been made by user - value is empty
        if(!elem.value) allSelected = false
    })
    // enable add to cart button when allSelected is true; otherwise, disable the button again
    enableAddToCart(allSelected)
}

/* add to cart callback */
const addToCartCallback = (e) => {
    e.preventDefault()
    
    
    // get the bundle product variant ID
    const bundleProductVariantId = document.querySelector('.product-single__variants').value
    //get the bundle items' variant IDs selected by user
    let bundleItemsVariantIds = []
    document.querySelectorAll('.bundle-select').forEach( elem => {
        bundleItemsVariantIds.push(Number(elem.value))
    } )

    // push in the bundle product variant as the 1st cart line item
    let data= {
        items: [
            {
                id: bundleProductVariantId,
                properties: {
                    '_is_bundle': 'yes',
                    '_bundle_items_variants': bundleItemsVariantIds
                }
            }
        ]
    }

    // push in the bundle items variants as the other cart line items
    bundleItemsVariantIds.forEach( variantId => {
        data.items.push({
            id: variantId,
            properties: {
                '_is_bundle_item': 'yes'
            }
        })
    })

    console.log(data)

    // use AJAX API to add multiple variants into cart
    fetch('/cart/add.js',{
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
}
