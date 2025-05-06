let totalNotifications = 0;
const subMenu = (subMenuName, notification, link) => {
  if (notification > 0) {
    totalNotifications += notification;
    return `
      <div class="subMenu" data-link="${link}">
        <p class="subMenu__name">${subMenuName}</p>
        <span class="subMenu__notification" notification="${notification}">
          <span class="subMenu__notification--number">${notification}</span>
        </span>
      </div>
    `;
  }

  return `
    <div class="subMenu" data-link="${link}">
      <p class="subMenu__name">${subMenuName}</p>
    </div>
  `;
};

const getTotalNotifications = () => totalNotifications;

export { subMenu, getTotalNotifications };