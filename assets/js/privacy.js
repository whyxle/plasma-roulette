(function () {
  const modal = document.getElementById("privacy-modal");
  const link = document.getElementById("privacy-link");
  const closeButton = modal.querySelector(".close");
  const privacyTextEl = document.getElementById("privacy-text");

  const privacyText = `Политика конфиденциальности и условия обработки данных

1. Общие положения

1.1. Настоящая Политика является официальным документом, регулирующим принципы и порядок обработки данных.
1.2. Использование сайта пользователем означает согласие с положениями настоящей Политики. В случае несогласия пользователь обязан воздержаться от использования сайта.
1.3. Разработчики сайта подтверждают приверженность принципам законности, добросовестности и минимизации обработки персональных данных.

2. Персональные данные пользователей

2.1. Разработчики сайта не используют данные о геолокации в личных, коммерческих, аналитических или рекламных целях, не передают их третьим лицам и не осуществляют хранения.
2.2. Данные о пользователе удаляются сразу после соблюдения условий для участия в розыгрыше.

3. Порядок начисления игровой валюты

3.1. При использовании интерактивных игровых элементов сайта, в частности функции «Колесо удачи», пользователь может получить виртуальное вознаграждение в виде игровой валюты.
3.2. Начисление игровой валюты осуществляется в автоматическом или полуавтоматическом режиме в течение 24 часов с момента фиксации факта выигрыша.`;

  function openModal(event) {
    event.preventDefault();
    privacyTextEl.textContent = privacyText;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  link.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
})();
