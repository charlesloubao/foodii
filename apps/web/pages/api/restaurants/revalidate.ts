import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

type RevalidateResponse = { revalidated: boolean } | { message: string }

function revalidateRestaurantPage(restaurantId: string, res: NextApiResponse): Promise<any> {
    return res.revalidate(`/restaurants/${restaurantId}`)
}

function onMenuItemsAndCategoryChange(req: NextApiRequest, res: NextApiResponse<RevalidateResponse>, record: any, oldRecord: any) {
    let {restaurant_id} = record ?? oldRecord
    return revalidateRestaurantPage(restaurant_id, res)
}

function onRestaurantChange(req: NextApiRequest, res: NextApiResponse<RevalidateResponse>, record: any, oldRecord: any) {
    let {id} = record ?? oldRecord
    return revalidateRestaurantPage(id, res)
}

const handler: NextApiHandler<RevalidateResponse> = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: `${req.method} is not allowed`
        })
    }

    const secret = req.query.secret
    const {table, record, old_record} = req.body

    if (secret !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({message: 'Invalid token'})
    }

    try {
        switch (table) {
            case "menu_items":
            case "menu_categories":
                await onMenuItemsAndCategoryChange(req, res, record, old_record)
                break
            case "restaurants":
                await onRestaurantChange(req, res, record, old_record)
                break
            default:
                return res.status(400).json({message: "invalid request"})
        }
        return res.json({revalidated: true})
    } catch (e) {
        return res.status(500).send({message: 'Error revalidating'})
    }
}

export default handler