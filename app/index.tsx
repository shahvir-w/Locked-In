import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './../components/Initialize';
import { auth } from '../configs/FirebaseConfig'
import { Redirect } from "expo-router";

export default function Index() {
  const user = auth.currentUser;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ?
        <Redirect href='../app/(tabs)/habits'/> :
        <Initialize />
      }
    </SafeAreaView>
  );
}
