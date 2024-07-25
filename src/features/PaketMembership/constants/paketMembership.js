import iconPersonal from '../../../assets/icons/member-personal.svg'
import iconCouple from '../../../assets/icons/member-couple.svg'
import iconFamily from '../../../assets/icons/member-family.svg'
import iconCorporate from '../../../assets/icons/member-corporate.svg'

export const getMembershipIcon = (keanggotaan) => {
    switch (keanggotaan) {
        case "Personal":
            return iconPersonal
        case "Couple":
            return iconCouple
        case "Family":
            return iconFamily
        case "Corporate":
            return iconCorporate
        default:
            return iconPersonal
    }
}

export const jenisKeanggotaan = ['Personal', 'Couple', 'Family', 'Family Add On', 'Corporate']