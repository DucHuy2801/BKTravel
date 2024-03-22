const StatusTour = {
    WAITING: 'waiting',
    ONLINE: 'online',
    DELETED: 'deleted'
}

const StatusOrder = {
    CANCEL: 'Hủy',
    NOT_PAYMENT: 'Chưa thanh toán',
    PAYMENT: 'Đã thanh toán'
}

const RoleUser = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

const TypeDiscount = {
    FIXED: "fixed",
    PERCENTAGE: "percentage"
}

module.exports = {
    StatusTour,
    StatusOrder,
    RoleUser,
    TypeDiscount
}