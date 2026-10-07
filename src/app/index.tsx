	import { RecipeList } from "@/components/recipes/RecipeList";
import { SafeAreaView } from "react-native-safe-area-context";
	 
	export default function HomeScreen() {
	  return (
	    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
	      <RecipeList />
	    </SafeAreaView>
	  );
	}