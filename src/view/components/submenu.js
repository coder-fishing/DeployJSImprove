let totalNotifications = 0;
const subMenu = (subMenuName, notification ,link) => {
  if (notification > 0) {
    totalNotifications += notification;
    return `
      <a class="subMenu" href="${link}">
        <p class="subMenu__name">${subMenuName}</p>
        <span class="subMenu__notification" notification="${notification}">
          <span class="subMenu__notification--number">${notification}</span>
        </span>
      </a>
    `;
  }

  return `
    <a class="subMenu" href="${link}">
      <p class="subMenu__name">${subMenuName}</p>
    </a>
  `;
};
const getTotalNotifications = () => totalNotifications;

export { subMenu, getTotalNotifications };