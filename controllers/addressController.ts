import {Request, Response} from "express";
import {ResponseHandler} from "../util/ResponseHandler";
import {IUser} from "../database/models/IUser";
import {TokenHandler} from "../util/TokenHandler";
import AddressTable from "../database/schemas/addressSchema";
import mongoose from "mongoose";
import {IAddress} from "../database/models/IAddress";

/**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/addresses/new
 * @body : mobile,flat,landmark,street,city,state,country,pinCode
 * @method : POST
 * @access : PRIVATE
 */
export const createNewAddress = async (request: Request, response: Response) => {
    try {
        const {mobile, flat, landmark, street, city, state, country, pinCode} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            //check if already has an address
            const address = await AddressTable.findOne({userObj: new mongoose.Types.ObjectId(user._id)});
            if (address) {
                await AddressTable.findByIdAndDelete(new mongoose.Types.ObjectId(address._id));
            }
            // create an address
            const newAddress: IAddress = {
                name: user.username,
                email: user.email,
                mobile: mobile,
                flat: flat,
                landmark: landmark,
                street: street,
                city: city,
                state: state,
                country: country,
                pinCode: pinCode,
                userObj: user._id
            };
            const createdAddress = await new AddressTable(newAddress).save();
            if (createdAddress) {
                return ResponseHandler.sendData(response, 200, createdAddress, "Address is Created")
            }
        }
    } catch (error) {
        ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Update Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : mobile,address,landmark,street,city,state,country,pinCode
 * @method : PUT
 * @access : PRIVATE
 */
export const updateAddress = async (request: Request, response: Response) => {
    try {
        const {addressId} = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const {mobile, flat, landmark, street, city, state, country, pinCode} = request.body;
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const newAddress: IAddress = {
                name: user.username,
                email: user.email,
                mobile: mobile,
                flat: flat,
                landmark: landmark,
                street: street,
                city: city,
                state: state,
                country: country,
                pinCode: pinCode,
                userObj: user._id
            };
            const updatedAddress = await AddressTable.findByIdAndUpdate(mongoAddressId, {
                $set: newAddress
            }, {new: true});
            if (updatedAddress) {
                return ResponseHandler.sendData(response, 200, updatedAddress, "Address is Updated")
            }
        }
    } catch (error) {
        ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Get Address
 * @url : http://localhost:9000/api/addresses/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAddress = async (request: Request, response: Response) => {
    try {
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const address: IAddress | any = await AddressTable.findOne({userObj: new mongoose.Types.ObjectId(user._id)});
            if (!address) {
                return ResponseHandler.sendData(response, 200, {}, "No Address Found");
            }
            return ResponseHandler.sendData(response, 200, address, "");
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}

/**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteAddress = async (request: Request, response: Response) => {
    try {
        const {addressId} = request.params;
        const mongoAddressId = new mongoose.Types.ObjectId(addressId);
        const user: IUser | any = await TokenHandler.getUserData(request);
        if (user) {
            const deletedAddress = await AddressTable.findByIdAndDelete(mongoAddressId);
            if (deletedAddress) {
                return ResponseHandler.sendData(response, 200, {}, "Address is Deleted");
            }
        }
    } catch (error) {
        return ResponseHandler.sendErrors(response, 500, error);
    }
}