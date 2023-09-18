drop trigger if exists prevent_order_deletion;
drop trigger if exists update_order_status_by_train_package;
drop trigger if exists update_order_status_by_truck_package;
drop trigger if exists update_order_status_accTO_order_in_store;
delimiter $$

create trigger prevent_order_deletion
before delete on orders
for each row
begin
	if orders.trackingNo != 1 or orders.trackingNo != 2 then 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete shipped orders';
end if;
end$$


create trigger update_order_status_by_train_package
after insert on train_package
for each row
begin
	update orders set trackingNo = 4
    where orderID = new.orderID;
end$$

create trigger update_order_status_accTO_order_in_store
after insert on order_in_store
for each row
begin
	update orders set trackingNo = 5
    where orderID = new.orderID;
end$$

create trigger update_order_status_by_truck_package
after insert on truck_packages
for each row
begin
	update orders set trackingNo = 6
    where orderID = new.orderID;
end$$
delimiter ;