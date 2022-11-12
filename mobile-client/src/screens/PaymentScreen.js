import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

import CurrentAmountInfo from "../components/CurrentAmountInfo";
import PaymentPart from "../components/PaymentPart";

// import { useSelector } from "react-redux";
// import { selectTravelTimeInformation,selectImage, selectName, selectAmount, selectDestination} from "../slice/navSlice";

const PaymentScreen = () => {
	return (
		<View>
			<View style={tw`h-1/3`}>
				<CurrentAmountInfo />
			</View>

			<View style={tw`h-2/3`}>
				<PaymentPart />
			</View>
		</View>
	);
};

export default PaymentScreen;
