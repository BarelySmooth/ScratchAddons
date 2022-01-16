export default async function ({ addon, global, console }) {
  let sprites_container = document.querySelector('[class^="sprite-selector_items-wrapper"]');
  let search_box_container = document.createElement("div");
  let search_box = document.createElement("input");
  let x_button_container = document.createElement("div");
  search_box_container.setAttribute("class", "library_filter-bar-item_99aoX library_filter_2k-oj filter_filter_1JFal sa-sprite-search-box-container");
  search_box.setAttribute("type", "search");
  search_box.setAttribute("placeholder", "Search sprites...");
  search_box.setAttribute("id", "sa-sprite-search-box");
  search_box.setAttribute("class", "filter_filter-input_1iiEt");
  search_box.setAttribute("autocomplete", "off");
  x_button_container.setAttribute("class", "filter_x-icon-wrapper_1rP2w");

  await addon.tab.waitForElement('[class^="sprite-selector_items-wrapper"]');

  let sprite_selector_container = document.querySelector('[class^="sprite-selector_scroll-wrapper"]');
  sprite_selector_container.insertBefore(search_box_container, sprites_container);
  search_box_container.innerHTML = '<img class="filter_filter-icon_3Pfaw" src="/static/assets/a4451ef35d29c4997f7c8e837da8af44.svg">';
  search_box_container.appendChild(search_box);
  search_box_container.appendChild(x_button_container);
  x_button_container.innerHTML = '<img class="filter_x-icon_zjpOg" src="/static/assets/9c49ade683c0f0d75796136ff5d1030f.svg">';
  
  addon.tab.displayNoneWhileDisabled(search_box, { display: "block" });
  addon.self.addEventListener("disabled", () => {
    for (let i = 0; i < sprites_container.children.length; i++) {
      sprites_container.children[i].style.display = "block";
    }
  });
  addon.self.addEventListener("reenabled", () => {
    search_box.value = "";
  });

  search_box.oninput = () => {
    if (search_box.value) {
      x_button_container.style.opacity = 1;
      document.querySelector('.filter_x-icon-wrapper_1rP2w img').style.transform = "translateX(0px)";

      for (let i = 0; i < sprites_container.children.length; i++) {
        if (
          sprites_container.children[i].children[0].children[1].innerText
            .toLowerCase()
            .includes(search_box.value.toLowerCase())
        ) {
          sprites_container.children[i].style.display = "block";
        } else if (
          sprites_container.children[i].children[0].children[2].children[0].innerText
            .toLowerCase()
            .includes(search_box.value.toLowerCase()) &&
          sprites_container.children[i].children[0].classList.contains("sa-folders-folder")
        ) {
          sprites_container.children[i].style.display = "block";
        } else {
          sprites_container.children[i].style.display = "none";
        }
      }
    } else {
      x_button_container.style.opacity = 0;

      for (let i = 0; i < sprites_container.children.length; i++) {
        sprites_container.children[i].style.display = "block";
      }
    }
  };

  console.log(x_button_container);
  x_button_container.onclick = () => {
    search_box.value = "";
    x_button_container.style.opacity = 0;
    for (let i = 0; i < sprites_container.children.length; i++) {
      sprites_container.children[i].style.display = "block";
    }
  };

  while (true) {
    await addon.tab.waitForElement("div[class^='sprite-selector_items-wrapper']", {
      markAsSeen: true,
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });

    sprites_container = document.querySelector('[class^="sprite-selector_items-wrapper"]');
    sprite_selector_container = document.querySelector('[class^="sprite-selector_scroll-wrapper"]');
    sprite_selector_container.insertBefore(search_box_container, sprites_container);
    search_box_container.appendChild(search_box);
    search_box_container.appendChild(x_button_container);
    x_button_container.innerHTML = '<img class="filter_x-icon_zjpOg" src="/static/assets/9c49ade683c0f0d75796136ff5d1030f.svg">';
  }
}
