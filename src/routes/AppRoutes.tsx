import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function ForumRedirect() {
  useEffect(() => {
    window.location.href = "https://rhinesolution.discourse.group/latest";
  }, []);

  return null;
}

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About/About'));
const Portfolio = lazy(() => import('../pages/Portfolio/Portfolio'));
const StartProject = lazy(() => import('../pages/StartProject'));
const Services = lazy(() => import('../pages/Services/Services'));
const WebDevelopment = lazy(() => import('../pages/Services/WebDevelopment'));
const CloudInfrastructure = lazy(() => import('../pages/Services/CloudInfrastructure'));
const ITConsulting = lazy(() => import('../pages/Services/ITConsulting'));
const DigitalTransformation = lazy(() => import('../pages/Services/DigitalTransformation'));

const Solutions = lazy(() => import('../pages/Solutions/Solutions'));
const EnterpriseSoftware = lazy(() => import('../pages/Solutions/EnterpriseSoftware'));
const AIAutomation = lazy(() => import('../pages/Solutions/AIAutomation'));
const CybersecuritySuite = lazy(() => import('../pages/Solutions/CybersecuritySuite'));
const DataAnalytics = lazy(() => import('../pages/Solutions/DataAnalytics'));

const Technology = lazy(() => import('../pages/Technology/Technology'));
const ShaderDemo = lazy(() => import('../pages/Technology/ShaderDemo'));
const AIIntegration = lazy(() => import('../pages/Technology/AIIntegration'));
const AdvancedAnalytics = lazy(() => import('../pages/Technology/AdvancedAnalytics'));
const MobileApp = lazy(() => import('../pages/Technology/MobileApp'));
const EdgeComputing = lazy(() => import('../pages/Technology/EdgeComputing'));
const VideoStreaming = lazy(() => import('../pages/Technology/VideoStreaming'));
const TeamCollaboration = lazy(() => import('../pages/Technology/TeamCollaboration'));
const Gamification = lazy(() => import('../pages/Technology/Gamification'));
const AdvancedCMS = lazy(() => import('../pages/Technology/AdvancedCMS'));
const DeveloperPlatform = lazy(() => import('../pages/Technology/DeveloperPlatform'));
const WebGPU3D = lazy(() => import('../pages/Technology/WebGPU3D'));
const BlockchainWeb3 = lazy(() => import('../pages/Technology/BlockchainWeb3'));
const IoTEdge = lazy(() => import('../pages/Technology/IoTEdge'));
const CustomAPIs = lazy(() => import('../pages/Technology/CustomAPIs'));
const MultiTenant = lazy(() => import('../pages/Technology/MultiTenant'));
const AdvancedSecurity = lazy(() => import('../pages/Technology/AdvancedSecurity'));
const VoiceChat = lazy(() => import('../pages/Technology/VoiceChat'));
const ARVR = lazy(() => import('../pages/Technology/ARVR'));
const BlockchainIntegration = lazy(() => import('../pages/Technology/BlockchainIntegration'));
const PerformanceMonitoring = lazy(() => import('../pages/Technology/PerformanceMonitoring'));
const IoTIntegration = lazy(() => import('../pages/Technology/IoTIntegration'));
const AdvancedIntegrations = lazy(() => import('../pages/Technology/AdvancedIntegrations'));
const AdvancedSearchPage = lazy(() => import('../pages/Technology/AdvancedSearch'));
const ContinuousEvolution = lazy(() => import('../pages/Technology/ContinuousEvolution'));

const Resources = lazy(() => import('../pages/Resources/Resources'));
const CaseStudies = lazy(() => import('../pages/Resources/CaseStudies'));
const Documentation = lazy(() => import('../pages/Resources/Documentation'));
const BlogInsights = lazy(() => import('../pages/Resources/BlogInsights'));

const Contact = lazy(() => import('../pages/Contact'));
const Pricing = lazy(() => import('../pages/Pricing'));

const AdminPage = lazy(() => import('../pages/Admin'));
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

import ProtectedRoute from '../auth/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* New Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        
        {/* Start Project */}
        <Route path="/start-project" element={<StartProject />} />

        {/* Services */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/cloud-infrastructure" element={<CloudInfrastructure />} />
        <Route path="/services/it-consulting" element={<ITConsulting />} />
        <Route path="/services/digital-transformation" element={<DigitalTransformation />} />

        {/* Solutions */}
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/solutions/enterprise-software" element={<EnterpriseSoftware />} />
        <Route path="/solutions/ai-automation" element={<AIAutomation />} />
        <Route path="/solutions/cybersecurity-suite" element={<CybersecuritySuite />} />
        <Route path="/solutions/data-analytics" element={<DataAnalytics />} />

        {/* Technology */}
        <Route path="/technology" element={<Technology />} />
        <Route path="/technology/shader-demo" element={<ShaderDemo />} />
        <Route path="/technology/ai-integration" element={<AIIntegration />} />
        <Route path="/technology/advanced-analytics" element={<AdvancedAnalytics />} />
        <Route path="/technology/mobile-app" element={<MobileApp />} />
        <Route path="/technology/edge-computing" element={<EdgeComputing />} />
        <Route path="/technology/video-streaming" element={<VideoStreaming />} />
        <Route path="/technology/team-collaboration" element={<TeamCollaboration />} />
        <Route path="/technology/gamification" element={<Gamification />} />
        <Route path="/technology/advanced-cms" element={<AdvancedCMS />} />
        <Route path="/technology/developer-platform" element={<DeveloperPlatform />} />
        <Route path="/technology/webgpu-3d" element={<WebGPU3D />} />
        <Route path="/technology/blockchain-web3" element={<BlockchainWeb3 />} />
        <Route path="/technology/iot-edge" element={<IoTEdge />} />
        <Route path="/technology/custom-apis" element={<CustomAPIs />} />
        <Route path="/technology/multi-tenant" element={<MultiTenant />} />
        <Route path="/technology/advanced-security" element={<AdvancedSecurity />} />
        <Route path="/technology/voice-chat" element={<VoiceChat />} />
        <Route path="/technology/ar-vr" element={<ARVR />} />
        <Route path="/technology/blockchain-integration" element={<BlockchainIntegration />} />
        <Route path="/technology/performance-monitoring" element={<PerformanceMonitoring />} />
        <Route path="/technology/iot-integration" element={<IoTIntegration />} />
        <Route path="/technology/advanced-integrations" element={<AdvancedIntegrations />} />
        <Route path="/technology/advanced-search" element={<AdvancedSearchPage />} />
        <Route path="/technology/continuous-evolution" element={<ContinuousEvolution />} />

        {/* Resources */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/case-studies" element={<CaseStudies />} />
        <Route path="/resources/documentation" element={<Documentation />} />
        <Route path="/resources/blog-insights" element={<BlogInsights />} />
        <Route path="/resources/support-community" element={<ForumRedirect />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Pricing */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Existing admin/dashboard routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* Legal pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
