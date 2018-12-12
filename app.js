/***************************************************************/
/**********************  STORAGE CTRL  *************************/
/***************************************************************/

// Storage Controller

/***************************************************************/
/************************  ITEM CTRL  **************************/
/***************************************************************/

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  /***************************************************************/
  /*************************  DATA CTRL  *************************/
  /***************************************************************/

  // Data Structure / State
  const data = {
    items: [
      //   {
      //     id: 0,
      //     name: "Steak Dinner",
      //     calories: 1200
      //   },
      //   {
      //     id: 1,
      //     name: "Cookie",
      //     calories: 400
      //   },
      //   {
      //     id: 2,
      //     name: "Eggs",
      //     calories: 300
      //   }
    ],
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;

      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function() {
        let total = 0;

        // Loop through items and add cals
        data.items.forEach(item => {
            total += item.calories;
        });

        // Set total cal in data structure
        data.totalCalories = total;

        // Return total
        return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

/***************************************************************/
/**************************  UI CTRL  **************************/
/***************************************************************/

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: '.total-calories'
  };

  // Public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `
            <li id="item-${item.id}" class="collection-item">
                <strong>${item.name}: </strong> <em>${
          item.calories
        } Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
            `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement(`li`);
      // Add class
      li.className = "collection-item";
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
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(total) {
        document.querySelector(UISelectors.totalCalories).textContent = total;
    }
  };
})();

/***************************************************************/
/*************************  APP CTRL  **************************/
/***************************************************************/

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
