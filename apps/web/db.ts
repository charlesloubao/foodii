import {Restaurant} from "./data/Restaurant";
import {createClient} from "@supabase/supabase-js";
import {supabaseConfig} from "./supabaseConfig";

export const restaurants: Restaurant[] = [
    {
        id: "supapizza",
        name: "SupaPizza",
        description: "The Best Pizza in the world",
        imageURL: "https://unsplash.com/photos/MQUqbmszGGM/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8fHwxNjczMjY2Mzgz&force=true&w=640",
        menu: [
            {
                id: "0",
                name: "Signature pizzas",
                description: "Crafted pizzas",
                items: [
                    {
                        id: "pizza0",
                        name: "Peperoni Pizza",
                        description: "Pork peperoni pizza with a blend of mozzarella and asiago cheese",
                        price: 8.99
                    },
                    {
                        id: "pizza1",
                        name: "Margherita",
                        description: "Sauce and cheese",
                        price: 8.99
                    },
                    {
                        id: "pizza2",
                        name: "Breakfast",
                        description: "Egg, breakfast sausage, cheese",
                        price: 8.99
                    }
                ]
            }
        ]
    }
]

export const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.apiKey)