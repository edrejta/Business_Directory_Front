"use client";

import { useEffect, useState } from "react";
import BusinessForm from "@/components/BusinessForm";
import * as ownerApi from "@/lib/api/ownerBusinesses";
import { useRouter } from "next/navigation";

export default function EditBusinessClient({ id }: { id: string }) {
	const router = useRouter();
	const [initial, setInitial] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			setLoading(true);
			try {
				const data = await ownerApi.getBusinessById(id);
				if (!mounted) return;
				setInitial(data);
			} catch (err) {
				if (!mounted) return;
				setError(err instanceof Error ? err.message : String(err));
			} finally {
				if (mounted) setLoading(false);
			}
		};
		void load();
		return () => {
			mounted = false;
		};
	}, [id]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-600">{error}</div>;
	if (!initial) return <div>Business not found.</div>;

	async function handleSubmit(input: any) {
		try {
			await ownerApi.createUpdateRequest(id, { ...input });
			window.alert("Update request submitted — admin will review and apply changes.");
			router.push(`/business/${id}`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			window.alert(`Update failed: ${msg}`);
		}
	}

	return (
		<BusinessForm
			mode="edit"
			initial={initial}
			onCancel={() => router.push(`/business/${id}`)}
			onSubmit={handleSubmit}
		/>
	);
}
