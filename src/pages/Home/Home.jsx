import PopularClassesSlider from "@/components/Home/PopularClassesSlider";
import Banner from "../../components/Home/Banner";
import PartnersSection from "../../components/Home/PartnersSection";
import FeedbackSection from "@/components/Home/FeedBackSection";
import StatsSection from "@/components/Home/StatesSection";
import TeacherRecruitmentSection from "@/components/Home/TeacherRequirementSection";
import AdditionalSections from "@/components/Home/AdditionalSection";

const Home = () => {
    return (
        <div className="dark:bg-gray-900" >
            <Banner/>
            <PartnersSection/>
            <PopularClassesSlider/>
            <FeedbackSection/>
            <StatsSection/>
            <TeacherRecruitmentSection/>
            <AdditionalSections/>

        </div>
    );
};

export default Home;