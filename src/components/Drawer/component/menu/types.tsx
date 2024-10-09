interface MenuData {
  _id: string;
  title?: string;
  price?: string;
  description?: string;
  photo?: any;
  quantity?: string;
  cookingTime?: string;
  menuCategories?: string[];
  addOns?: iSubMenu[];
  varieties?: iSubMenu[];
}
interface iCategory {
  title: string;
  _id: string;
}

interface MenuModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMenu: MenuData;
  setSelectedMenu: React.Dispatch<React.SetStateAction<MenuData>>;
  fetchMenu: () => Promise<void>;
}
interface iCategoryDOM {
  label: string;
  value: string;
}

interface iSubMenu {
  title: string;
  price: number;
}
