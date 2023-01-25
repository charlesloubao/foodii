import {SWRResponse} from "swr";
import {ReactNode} from "react";

export type SWRResultProps<T> = {
    response: SWRResponse<T>,
    renderError: (error: any) => ReactNode,
    renderData: (data: T) => ReactNode,
    renderLoading: () => ReactNode
}

export default function SWRResult<T>({
                                         response,
                                         renderLoading,
                                         renderData,
                                         renderError
                                     }: SWRResultProps<T>) {

    if (response.isLoading) {
        return <>{renderLoading()}</>
    } else if (response.error) {
        return <>{renderError(response.error)}</>
    } else if (response.data) {
        return <>{renderData(response.data)}</>
    } else return <></>
}