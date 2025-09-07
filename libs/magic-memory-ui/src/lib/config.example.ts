// external-config.ts
export const magicMemoryConfig = {
  level: 6,
  lang: "es",

  // Несколько фонов — игра будет выбирать случайный на каждый запуск/повтор
  background: [
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1025/1200/800",
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
  ],

  // Рубашки карт (можно 1 или массив — возьмём случайно)
  backCard: [
    "https://picsum.photos/id/1069/600/900",
    "https://picsum.photos/id/1003/600/900",
  ],

  // Лица карт по уровням: даём ровно столько уникальных изображений,
  // сколько пар нужно (уровень 6 => 3 пары => минимум 3 уникальные ссылки;
  // но можно дать больше — мы возьмём случайные из массива).
  frontCards: {
    4: [
      "https://picsum.photos/id/10/400/400",
      "https://picsum.photos/id/11/400/400",
      "https://picsum.photos/id/12/400/400",
    ],
    6: [
      "https://picsum.photos/id/13/400/400",
      "https://picsum.photos/id/14/400/400",
      "https://picsum.photos/id/15/400/400",
      "https://picsum.photos/id/16/400/400",
      "https://picsum.photos/id/17/400/400",
      "https://picsum.photos/id/18/400/400",
    ],
    8: [
      "https://picsum.photos/id/19/400/400",
      "https://picsum.photos/id/20/400/400",
      "https://picsum.photos/id/21/400/400",
      "https://picsum.photos/id/22/400/400",
      "https://picsum.photos/id/23/400/400",
      "https://picsum.photos/id/24/400/400",
      "https://picsum.photos/id/25/400/400",
      "https://picsum.photos/id/26/400/400",
    ],
    10: [
      "https://picsum.photos/id/27/400/400",
      "https://picsum.photos/id/28/400/400",
      "https://picsum.photos/id/29/400/400",
      "https://picsum.photos/id/30/400/400",
      "https://picsum.photos/id/31/400/400",
      "https://picsum.photos/id/32/400/400",
      "https://picsum.photos/id/33/400/400",
      "https://picsum.photos/id/34/400/400",
      "https://picsum.photos/id/35/400/400",
      "https://picsum.photos/id/36/400/400",
    ],
    12: [
      "https://picsum.photos/id/37/400/400",
      "https://picsum.photos/id/38/400/400",
      "https://picsum.photos/id/39/400/400",
      "https://picsum.photos/id/40/400/400",
      "https://picsum.photos/id/41/400/400",
      "https://picsum.photos/id/42/400/400",
      "https://picsum.photos/id/43/400/400",
      "https://picsum.photos/id/44/400/400",
      "https://picsum.photos/id/45/400/400",
      "https://picsum.photos/id/46/400/400",
      "https://picsum.photos/id/47/400/400",
      "https://picsum.photos/id/48/400/400",
    ],
  },
} as const;
