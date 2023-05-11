import Card from "./components/card/card";
import Navbar from "./components/navbar";

export default () => 
<>
	<Navbar />
	<div className="content">
		<Card user="emperor" guild="test" title="This is a test post" content="What you call Linux is actually GNU/Linux or GNU plus Linux. Linux is the kernel, not the whole operating system. The GNU system, developed by the GNU Project, is a vital part of the complete OS. The version of GNU widely used today is often called Linux, but it's essentially GNU with Linux added, or GNU/Linux. Many users are not aware that they are running a modified version of the GNU system, with the Linux kernel handling resource allocation. Linux distributions are actually distributions of GNU/Linux."/>
	</div>
</> 
