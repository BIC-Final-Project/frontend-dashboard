import moment from 'moment';
import 'moment/locale/id'

export const convertFullDate = (date) => {
    return moment(date).format("dddd, D MMMM YYYY")
}