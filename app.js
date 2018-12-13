/***************************************************************/
/**********************  STORAGE CTRL  *************************/
/***************************************************************/

// Storage Controller

const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in LS
      if (localStorage.getItem ('items') === null) {
        items = [];
        // Push new item
        items.push (item);
        // Set LS
        localStorage.setItem ('items', JSON.stringify (items));
      } else {
        items = JSON.parse (localStorage.getItem ('items'));
        items.push (item);
        localStorage.setItem ('items', JSON.stringify (items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem ('items') === null) {
        items = [];
      } else {
        items = JSON.parse (localStorage.getItem ('items'));
      }
      return items;
    },
    updateItemStorage: function (updateItem) {
      let items = JSON.parse (localStorage.getItem ('items'));

      items.forEach ((item, index) => {
        if (updateItem.id === item.id) {
          items.splice (index, 1, updateItem);
        }
      });
      localStorage.setItem ('items', JSON.stringify (items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse (localStorage.getItem ('items'));

      items.forEach ((item, index) => {
        if (id === item.id) {
          items.splice (index, 1);
        }
      });
      localStorage.setItem ('items', JSON.stringify (items));
    },
    clearItemsFromStorage: function() {
     localStorage.removeItem('items');
    }
  };
}) ();

/***************************************************************/
/************************  ITEM CTRL  **************************/
/***************************************************************/

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage (),
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;

      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt (calories);

      // Create new item
      const newItem = new Item (ID, name, calories);

      // Add to items array
      data.items.push (newItem);

      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach (item => {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach (item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updatedItem: function (name, calories) {
      // Calories to number
      calories = parseInt (calories);

      let found = null;

      data.items.forEach (item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map (item => item.id);

      // Get index
      const index = ids.indexOf (id);
      // Remove item
      data.items.splice (index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    logData: function () {
      return data;
    },
  };
}) ();

/***************************************************************/
/**************************  UI CTRL  **************************/
/***************************************************************/

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
  };

  // Public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach (item => {
        html += `
            <li id="item-${item.id}" class="collection-item">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
            `;
      });

      // Insert list items
      document.querySelector (UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function () {
      return UISelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector (UISelectors.itemNameInput).value,
        calories: document.querySelector (UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show the list
      document.querySelector (UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement (`li`);
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
        </a>
       `;
      // Insert item
      document
        .querySelector (UISelectors.itemList)
        .insertAdjacentElement ('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll (UISelectors.listItems);

      // Turn NodeList into array
      listItems = Array.from (listItems);
      listItems.forEach (listItem => {
        const itemID = listItem.getAttribute ('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector (`#${itemID}`).innerHTML = `
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
       <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
       </a>
       `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector (itemID);
      item.remove ();
    },
    clearInput: function () {
      document.querySelector (UISelectors.itemNameInput).value = '';
      document.querySelector (UISelectors.itemCaloriesInput).value = '';
    },
    removeItems: function () {
      let listItems = document.querySelectorAll (UISelectors.listItems);

      // Turn NodeList into array
      listItems = Array.from (listItems);
      listItems.forEach (listItem => listItem.remove ());
    },
    addItemToForm: function () {
      document.querySelector (
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem ().name;
      document.querySelector (
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem ().calories;
      UICtrl.showEditState ();
    },
    hideList: function () {
      document.querySelector (UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (total) {
      document.querySelector (UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function () {
      UICtrl.clearInput ();
      document.querySelector (UISelectors.updateBtn).style.display = 'none';
      document.querySelector (UISelectors.deleteBtn).style.display = 'none';
      document.querySelector (UISelectors.backBtn).style.display = 'none';
      document.querySelector (UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector (UISelectors.updateBtn).style.display = 'inline';
      document.querySelector (UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector (UISelectors.backBtn).style.display = 'inline';
      document.querySelector (UISelectors.addBtn).style.display = 'none';
    },
  };
}) ();

/***************************************************************/
/*************************  APP CTRL  **************************/
/***************************************************************/

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors ();

    // Add item event
    document
      .querySelector (UISelectors.addBtn)
      .addEventListener ('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener ('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault ();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector (UISelectors.itemList)
      .addEventListener ('click', itemEditClick);

    // Update item event
    document
      .querySelector (UISelectors.updateBtn)
      .addEventListener ('click', itemUpdateSubmit);

    // Delete item event
    document
      .querySelector (UISelectors.deleteBtn)
      .addEventListener ('click', itemDeleteSubmit);

    // Back button event
    document
      .querySelector (UISelectors.backBtn)
      .addEventListener ('click', UICtrl.clearEditState);

    // Clear items event
    document
      .querySelector (UISelectors.clearBtn)
      .addEventListener ('click', clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput ();

    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem (input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem (newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories ();

      // Add total calories to the UI
      UICtrl.showTotalCalories (totalCalories);

      // Store in localstorage
      StorageCtrl.storeItem (newItem);

      // Clear fields
      UICtrl.clearInput ();
    }

    e.preventDefault ();
  };

  // Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains ('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
     
      // Break into an array
      const listIdArr = listId.split ('-');

      // Get the actual id
      const id = parseInt (listIdArr[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById (id);
      // Set current item
      ItemCtrl.setCurrentItem (itemToEdit);

      // Add item to form
      UICtrl.addItemToForm ();
    }

    e.preventDefault ();
  };

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput ();

    // Update item
    const updatedItem = ItemCtrl.updatedItem (input.name, input.calories);

    // Update UI
    UICtrl.updateListItem (updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories ();

    // Add total calories to the UI
    UICtrl.showTotalCalories (totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage (updatedItem);

    UICtrl.clearEditState ();

    e.preventDefault ();
  };

  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem ();

    // Delete from data structure
    ItemCtrl.deleteItem (currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem (currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories ();

    // Add total calories to the UI
    UICtrl.showTotalCalories (totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage (currentItem.id);

    UICtrl.clearEditState ();

    e.preventDefault ();
  };

  // Clear items event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems ();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories ();

    // Add total calories to the UI
    UICtrl.showTotalCalories (totalCalories);

    // Remove from UI
    UICtrl.removeItems ();

    // Remove from storage
    StorageCtrl.clearItemsFromStorage ();

    // Hide the ul
    UICtrl.hideList ();
  };

  // Public methods
  return {
    init: function () {
      // Clear edit state / set init state
      UICtrl.clearEditState ();

      // Fetch Items from data structure
      const items = ItemCtrl.getItems ();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList ();
      } else {
        // Populate list with items
        UICtrl.populateItemList (items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories ();

      // Add total calories to the UI
      UICtrl.showTotalCalories (totalCalories);

      // Load event listeners
      loadEventListeners ();
    },
  };
}) (ItemCtrl, StorageCtrl, UICtrl);

App.init ();
