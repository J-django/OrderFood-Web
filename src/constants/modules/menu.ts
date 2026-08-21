import type { MenuCategory, MenuItem } from '@/types'

export const menuCategories = ['全部', '主食', '小吃', '饮品', '其他'] as const

export type MenuCategoryFilter = (typeof menuCategories)[number]

export const menuItems: MenuItem[] = [
  {
    id: 'beef-rice',
    name: '香煎三文鱼饭',
    category: '主食',
    price: 28,
    image: '/images/menu/beef-rice.jpg',
    ingredients: '三文鱼、杂粮饭、四季豆、圣女果',
    seasonings: '海盐、黑胡椒、橄榄油、香草',
    method:
      '三文鱼擦干后用海盐和黑胡椒调味，平底锅煎至表面金黄，搭配杂粮饭、四季豆与圣女果装盘。',
  },
  {
    id: 'chicken-bowl',
    name: '彩椒香煎鸡饭',
    category: '主食',
    price: 25,
    image: '/images/menu/chicken-bowl.jpg',
    ingredients: '鸡胸肉、米饭、彩椒、罗勒',
    seasonings: '海盐、黑胡椒、橄榄油、香草汁',
    method:
      '鸡胸肉切块并调味，热锅煎至表面金黄，加入彩椒与香草汁快速翻炒，搭配米饭装盘。',
  },
  {
    id: 'shrimp-noodle',
    name: '鲜虾云吞面',
    category: '主食',
    price: 23,
    image: '/images/menu/shrimp-noodle.jpg',
    ingredients: '鲜虾、猪肉、细面、小青菜',
    seasonings: '高汤、白胡椒、麻油、葱花',
    method:
      '鲜虾与猪肉调馅包成云吞，放入高汤煮熟；细面另锅煮至爽滑，加入青菜后盛入汤碗，撒葱花和白胡椒。',
  },
  {
    id: 'crispy-wings',
    name: '香脆鸡翅',
    category: '小吃',
    price: 19,
    image: '/images/menu/crispy-wings.jpg',
    ingredients: '鸡中翅、鸡蛋、面包糠',
    seasonings: '海盐、辣椒粉、蒜粉',
    method:
      '鸡翅划刀后充分腌制，依次裹蛋液和面包糠，放入热油炸至表面金黄酥脆，出锅后撒少量海盐。',
  },
  {
    id: 'garden-salad',
    name: '田园时蔬沙拉',
    category: '小吃',
    price: 16,
    image: '/images/menu/garden-salad.jpg',
    ingredients: '生菜、圣女果、黄瓜、玉米',
    seasonings: '橄榄油、柠檬汁、海盐、黑胡椒',
    method:
      '所有蔬菜洗净沥干并切成适口大小，食用前加入橄榄油、柠檬汁、海盐和黑胡椒轻轻拌匀。',
  },
  {
    id: 'lemon-soda',
    name: '鲜柠气泡水',
    category: '饮品',
    price: 12,
    image: '/images/menu/lemon-soda.jpg',
    ingredients: '鲜柠檬、气泡水、冰块、薄荷',
    seasonings: '蜂蜜',
    method:
      '杯中放入柠檬片和少量蜂蜜轻压出汁，加入冰块后缓慢倒入气泡水，最后用薄荷叶点缀。',
  },
]

export function isMenuCategory(
  category: MenuCategoryFilter,
): category is MenuCategory {
  return category !== '全部'
}

export function getMenuItem(itemId: string | undefined) {
  return menuItems.find((item) => item.id === itemId)
}
