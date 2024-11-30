import { useUserStore } from "@/entities/User";
import { Header } from "@/widgets/Header/ui/Header";
import {
	Avatar,
	Button,
	Card,
	CardHeader,
	Skeleton,
	SkeletonItem,
	Text,
	Title2,
	Title3,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from "@fluentui/react-components";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { $api } from "@/shared/api/api";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { getExcelPage } from "@/shared/consts/router";

const MainPage = memo(() => {
	const toasterId = useId("toaster-mainpage");
	const { dispatchToast } = useToastController(toasterId);

	const nav = useNavigate();
	const { user } = useUserStore();
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const [excels, setExcels] = useState<ExcelFile[]>([]);

	const createExcel = async () => {
		try {
			const res = await $api.post<{ name: string }, AxiosResponse<ExcelFile>>("/excel");
			if (res.data) {
				nav(getExcelPage(res.data.id));
			}
		} catch (e) {
			notify();
			console.log(e);
		}
	};

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch excel")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	useEffect(() => {
		const fetchExcels = async () => {
			try {
				setIsLoading(true);
				const res = await $api.get<void, AxiosResponse<ExcelFile[]>>("/excel/user1");
				if (res.data) {
					setExcels(res.data);
				} else {
					notify();
				}
			} catch (e) {
				console.log(e);
				notify();
			} finally {
				setIsLoading(false);
			}
		};
		fetchExcels();
	}, []);

	return (
		<>
			<Toaster toasterId={toasterId} />
			<Header />
			<div className="p-3">
				<div className="flex justify-between">
					<Title2>
						{t("Hello")}, {user?.firstName} {user?.lastName}!
					</Title2>
					<Button onClick={createExcel}>{t("create")}</Button>
				</div>

				<div
					className={excels.length === 0 ? "flex justify-center items-center h-64" : "grid grid-cols-3 gap-3 p-2 pt-6"}
				>
					{excels.length === 0 && <Title3>{t("no tables")}</Title3>}
					{isLoading ? (
						<>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
						</>
					) : (
						excels?.map((excel) => (
							<Card>
								<CardHeader>
									<Title3>{excel.name}</Title3>
								</CardHeader>
								<div className="flex gap-2">
									<Avatar
										aria-label={excel.creator.firstName}
										name={excel.creator.firstName + " " + excel.creator.lastName}
										badge={{ status: "available" }}
									/>
									<Text>
										{excel.creator.firstName} {excel.creator.lastName}
									</Text>
								</div>
							</Card>
						))
					)}
				</div>
			</div>
		</>
	);
});

export default MainPage;
