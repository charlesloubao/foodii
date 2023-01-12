import {MenuItem} from "../lib/MenuItem";

export type MenuItemCardProps = {
    item: MenuItem
}
export default function MenuItemCard({item}: MenuItemCardProps) {
    return <div
        className="border hover:border-2 hover:border-gray-300 cursor-pointer rounded-md p-4 flex gap-4 items-center"
        key={item.id}>
        <div className="flex-1">
            <h4 className="font-bold mb-1">{item.name}</h4>
            <p className="mb-1">{item.description}</p>
            <strong>${item.price}</strong>
        </div>
        <div className="w-[100px] h-[100px] rounded-md object-cover overflow-hidden">
            {item.imageURL != null && <img className="w-full h-full" src={item.imageURL} alt=""/>}
        </div>
    </div>
}