	import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { usePerf } from "./perf";
import { MemoRecipeCard } from "./RecipeCard";
import { fetchRecipes, Recipe } from "./recipes-api";
	 
	export function RecipeList() {
	  const mounted = usePerf("FlashList paginée");
	  const [recipes, setRecipes] = useState<Recipe[]>([]);
	  const [hasMore, setHasMore] = useState(true);
	  const [isRefreshing, setIsRefreshing] = useState(false);
	  const [error, setError] = useState("");
	  const nextPage = useRef(0);
	  const isLoading = useRef(false);
	 
	  async function load(reset: boolean) {
	    // Garde-fou : un seul chargement à la fois, et rien après la dernière page
	    if (isLoading.current || (!reset && !hasMore)) return;
	    isLoading.current = true;
	    setError("");
	    if (reset) {
	      nextPage.current = 0;
	      setIsRefreshing(true);
	    }
	 
	    const result = await fetchRecipes(nextPage.current);
	    if (result.error) {
	      setError(result.error);
	      setIsRefreshing(false);
	      isLoading.current = false;
	      return;
	    }

	    nextPage.current += 1;
	    setRecipes((previous) => (reset ? result.items : [...previous, ...result.items]));
	    setHasMore(result.hasMore);
	    setIsRefreshing(false);
	    isLoading.current = false;
	  }
	 
	  useEffect(() => {
	    load(true);
	  }, []);
	 
	  return (
	    <View style={{ flex: 1 }}>
	      <Text style={styles.counter}>
	        Chargées : {recipes.length} · Montées : {mounted}
	      </Text>
	      <FlashList
	        data={recipes}
	        renderItem={({ item }) => <MemoRecipeCard recipe={item} />}
	        keyExtractor={(item) => item.id}
	        onEndReached={() => load(false)}
	        onEndReachedThreshold={2}
	        refreshing={isRefreshing}
	        onRefresh={() => load(true)}
	        ListFooterComponent={hasMore ? <ActivityIndicator style={styles.footer} /> : null}
	      />
		  {error && (
		    <View>
		      <Text style={styles.counter}>{error}</Text>
		      <Button title="Réessayer" onPress={() => load(true)} />
		    </View>
		  )}
	    </View>
	  );
	}
	 
	const styles = StyleSheet.create({
	  counter: { padding: 8, textAlign: "center", fontWeight: "600" },
	  footer: { padding: 16 },
	});