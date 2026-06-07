/**
 * Slow Brew Cafe - Menu Data and Rendering Engine
 */

export const menuItems = [
  {
    id: "item-1",
    name: "슬로우 드립 (Slow Drip)",
    category: "coffee",
    price: 4.50,
    description: "싱글 오리진 원두를 정성스럽게 핸드드립으로 추출하여 깔끔한 산미와 풍부한 바디감을 자랑합니다.",
    tags: ["Signature", "Slow Roasting"],
    avatar: "☕"
  },
  {
    id: "item-2",
    name: "클래식 라떼 (Classic Latte)",
    category: "coffee",
    price: 5.50,
    description: "진한 에스프레소에 미세한 공기방울로 완벽한 질감을 낸 부드러운 스팀 우유를 더했습니다.",
    tags: ["Hot/Ice"],
    avatar: "🥛"
  },
  {
    id: "item-3",
    name: "코르타도 (Cortado)",
    category: "coffee",
    price: 4.00,
    description: "에스프레소와 스팀 밀크를 1:1 비율로 섞어 커피의 강렬함과 부드러움을 동시에 느낄 수 있습니다.",
    tags: ["Bold"],
    avatar: "🥃"
  },
  {
    id: "item-4",
    name: "아인슈페너 (Einspänner)",
    category: "coffee",
    price: 6.00,
    description: "차가운 더치 커피 위에 깊고 풍부한 풍미의 수제 휩 크림을 두껍게 얹은 비엔나식 커피입니다.",
    tags: ["Sweet", "Signature"],
    avatar: "🍦"
  },
  {
    id: "item-5",
    name: "디카페인 콜드브루 (Decaf Cold Brew)",
    category: "coffee",
    price: 5.00,
    description: "12시간 동안 천천히 찬물로 우려내어 속이 편안하고 카페인 부담 없이 깔끔히 즐길 수 있습니다.",
    tags: ["Decaf", "Ice Only"],
    avatar: "❄️"
  },
  {
    id: "item-6",
    name: "세레모니얼 말차 (Ceremonial Matcha)",
    category: "tea",
    price: 6.00,
    description: "최고급 유기농 말차 가루를 격불하여 대접합니다. 깔끔하고 쌉싸름하며 깊은 우마미가 느껴집니다.",
    tags: ["Organic", "Whisked"],
    avatar: "🍵"
  },
  {
    id: "item-7",
    name: "카모마일 라벤더 (Chamomile Lavender)",
    category: "tea",
    price: 4.50,
    description: "마음을 차분하게 해주는 유기농 카모마일 꽃과 향긋한 프렌치 라벤더를 블렌딩한 웰니스 티입니다.",
    tags: ["Decaf", "Relaxing"],
    avatar: "🌸"
  },
  {
    id: "item-8",
    name: "얼그레이 리저브 (Earl Grey Reserve)",
    category: "tea",
    price: 5.00,
    description: "천연 베르가못 오일을 입힌 실론 홍차 잎에 향긋한 푸른 수레국화를 블렌딩한 프리미엄 티입니다.",
    tags: ["Classic"],
    avatar: "🍂"
  },
  {
    id: "item-9",
    name: "제주 우롱 (Jeju Oolong)",
    category: "tea",
    price: 5.50,
    description: "제주 화산토에서 자란 찻잎을 적절히 발효시켜 구수하면서도 은은한 과일 향이 나는 싱글 에스테이트 티입니다.",
    tags: ["Organic"],
    avatar: "🌱"
  },
  {
    id: "item-10",
    name: "아몬드 크로와상 (Almond Croissant)",
    category: "bites",
    price: 5.50,
    description: "결이 살아있는 바삭한 페이스트리에 고소한 아몬드 크림(프란지판)을 듬뿍 넣어 두 번 구워냈습니다.",
    tags: ["Warm", "Bakery"],
    avatar: "🥐"
  },
  {
    id: "item-11",
    name: "아보카도 사워도우 토스트 (Avocado Toast)",
    category: "bites",
    price: 9.00,
    description: "천연 발효종 사워도우 빵 위에 잘 익은 생 아보카도를 으깨 얹고 엑스트라 버진 올리브유와 레드페퍼를 곁들였습니다.",
    tags: ["Fresh", "Vegan"],
    avatar: "🥑"
  },
  {
    id: "item-12",
    name: "클래식 모닝 번 (Morning Bun)",
    category: "bites",
    price: 4.50,
    description: "시나몬 가루와 오렌지 제스트를 넣어 향긋한 설탕 결정을 입힌 겉바속촉 에스프레소 단짝 베이커리입니다.",
    tags: ["Sweet", "Warm"],
    avatar: "🥯"
  },
  {
    id: "item-13",
    name: "바닐라 피칸 타르트 (Pecan Tart)",
    category: "bites",
    price: 6.50,
    description: "버터 향 가득한 파이 속에 메이플 시럽과 은은한 바닐라빈 향, 바삭한 통피칸을 아낌없이 넣어 구웠습니다.",
    tags: ["Sweet"],
    avatar: "🥧"
  }
];

/**
 * Renders the menu items based on filter category and search query
 */
export function renderMenu(items, containerId, activeCategory = "all", searchQuery = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-outline text-5xl mb-3">search_off</span>
        <p class="font-headline-md text-headline-md text-primary opacity-70">일치하는 메뉴가 없습니다.</p>
        <p class="font-body-md text-body-md text-on-surface-variant text-sm mt-1">다른 검색어나 카테고리를 시도해보세요.</p>
      </div>
    `;
    return;
  }

  // Group items by category if rendering 'all', or just render the filtered list in a beautiful grid
  // To match the beautiful layout from the visual reference, we render card structures.
  // We can render each category separately if 'all' is active to keep that high-end organized structure, or a dynamic responsive layout.
  // The original has 3 columns: 커피, 티, 간단한 먹거리.
  // Let's preserve that stunning 3-column category structure! 
  
  if (activeCategory === "all" && !searchQuery) {
    const categories = {
      coffee: { title: "커피", icon: "local_cafe" },
      tea: { title: "티", icon: "water_drop" },
      bites: { title: "간단한 먹거리", icon: "cookie" }
    };

    let html = "";
    for (const [key, catInfo] of Object.entries(categories)) {
      const catItems = filteredItems.filter(item => item.category === key);
      if (catItems.length === 0) continue;

      html += `
        <div class="bg-surface-container-lowest p-8 rounded flex flex-col gap-stack-lg shadow-[0_4px_24px_rgba(60,42,33,0.03)] border border-surface-container-high transition-transform duration-300 hover:translate-y-[-4px]">
          <h3 class="font-headline-md text-headline-md text-primary text-center ebGaramond border-b border-surface-variant pb-stack-sm flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">${catInfo.icon}</span>
            ${catInfo.title}
          </h3>
          <div class="flex flex-col gap-6">
            ${catItems.map((item, idx) => `
              <div class="flex gap-4 items-start ${idx < catItems.length - 1 ? 'border-b border-surface-container-low pb-6' : ''}">
                <div class="text-3xl p-2 rounded-full bg-surface-container text-center flex items-center justify-center w-12 h-12 flex-shrink-0">
                  ${item.avatar}
                </div>
                <div class="flex-grow">
                  <div class="flex justify-between items-baseline mb-1">
                    <h4 class="font-body-lg text-body-lg text-on-surface font-semibold flex items-center gap-2">
                      ${item.name}
                      ${item.tags.includes("Signature") ? '<span class="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-semibold tracking-wider uppercase rounded-sm">SIGNATURE</span>' : ''}
                    </h4>
                    <span class="font-body-md text-body-md text-primary font-bold ml-2">$${item.price.toFixed(2)}</span>
                  </div>
                  <p class="font-body-md text-body-md text-on-surface-variant text-sm inline-block leading-relaxed">
                    ${item.description}
                  </p>
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    ${item.tags.map(tag => `
                      <span class="px-2 py-0.5 bg-surface text-on-surface-variant border border-outline-variant text-[11px] rounded-full">
                        #${tag}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    container.className = "grid grid-cols-1 md:grid-cols-3 gap-gutter";
    container.innerHTML = html;
  } else {
    // Single list grid layout (e.g. when category selected or searching)
    container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter";
    container.innerHTML = filteredItems.map(item => `
      <div class="bg-surface-container-lowest p-6 rounded flex flex-col justify-between gap-4 shadow-[0_4px_24px_rgba(60,42,33,0.02)] border border-surface-container-high transition-transform duration-300 hover:translate-y-[-4px]">
        <div class="flex gap-4 items-start">
          <div class="text-3xl p-2 rounded-full bg-surface-container text-center flex items-center justify-center w-12 h-12 flex-shrink-0">
            ${item.avatar}
          </div>
          <div class="flex-grow">
            <div class="flex justify-between items-baseline mb-1">
              <h4 class="font-body-lg text-body-lg text-on-surface font-semibold flex flex-wrap gap-1.5 items-center">
                <span>${item.name}</span>
                ${item.tags.includes("Signature") ? '<span class="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-semibold tracking-wider uppercase rounded-sm">SIGNATURE</span>' : ''}
              </h4>
              <span class="font-body-md text-body-md text-primary font-bold">$${item.price.toFixed(2)}</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed mb-2">
              ${item.description}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5 border-t border-surface-container-low pt-3 mt-1">
          ${item.tags.map(tag => `
            <span class="px-2 py-0.5 bg-surface text-on-surface-variant border border-outline-variant text-[11px] rounded-full">
              #${tag}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
}
