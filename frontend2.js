<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Veo Creator Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #5b21b6; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #4c1d95; }
  </style>
</head>
<body class="bg-gray-100">
  <div id="root"></div>

  <!-- Scripts do React -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Script do Cliente Supabase -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <script type="text/babel">
    // --- CONFIGURAÃÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://fwybynvjrnirryhhzilp.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3eWJ5bnZqcm5pcnJ5aGh6aWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTc3NjksImV4cCI6MjA2NTM3Mzc2OX0.eUu7kIU1nH1udBQM-GMkfA3cbTvn-5xVk7cK9EwVLGo';

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- COMPONENTE DE AUTENTICAÃÃO UNIFICADO ---
    function AuthForm({ isRegistering, onShowLogin, onShowRegister }) {
      const [formData, setFormData] = React.useState({ nome: '', data_nascimento: '', cpf: '', email: '', password: '' });
      const [error, setError] = React.useState('');
      const [success, setSuccess] = React.useState('');
      const [loading, setLoading] = React.useState(false);

      const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (isRegistering) {
          // LÃ³gica de registo
          const { error } = await supabaseClient.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { nome: formData.nome, data_nascimento: formData.data_nascimento, cpf: formData.cpf } }
          });
          if (error) setError(error.message);
          else setSuccess('Registo realizado! Verifique o seu e-mail para confirmaÃ§Ã£o, se necessÃ¡rio.');
        } else {
          // LÃ³gica de login
          const { error } = await supabaseClient.auth.signInWithPassword({ email: formData.email, password: formData.password });
          if (error) setError(error.message);
        }
        setLoading(false);
      };
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-purple-900">{isRegistering ? 'Crie a sua Conta' : 'Veo Creator Pro'}</h1>
              <p className="mt-2 text-gray-600">{isRegistering ? 'Ã rÃ¡pido e fÃ¡cil.' : 'FaÃ§a login para continuar'}</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center bg-green-100 p-3 rounded-lg">{success}</p>}
              {isRegistering && (
                <>
                  <input name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Nome completo" required/>
                  <input name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Data de Nascimento" required/>
                  <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="CPF" required/>
                </>
              )}
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="E-mail" required/>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Senha (mÃ­nimo 6 caracteres)" required/>
              <button type="submit" disabled={loading || success} className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-purple-400">
                {loading ? (isRegistering ? 'A registar...' : 'A entrar...') : (isRegistering ? 'Registar' : 'Entrar')}
              </button>
              <p className="text-sm text-center text-gray-500">
                {isRegistering ? 'JÃ¡ tem uma conta? ' : 'NÃ£o tem uma conta? '}
                <button type="button" onClick={isRegistering ? onShowLogin : onShowRegister} className="font-semibold text-purple-700 hover:text-purple-900 focus:outline-none">
                  {isRegistering ? 'FaÃ§a login' : 'Criar conta'}
                </button>
              </p>
            </form>
          </div>
        </div>
      );
    }
    
    // --- COMPONENTE PRINCIPAL DA APLICAÃÃO ---
    function MainApp({ session }) {
      const [sujeito, setSujeito] = React.useState('');
      const [acao, setAcao] = React.useState('');
      const [cenario, setCenario] = React.useState('');
      const [selectedEstiloVisual, setSelectedEstiloVisual] = React.useState([]);
      const [selectedCameras, setSelectedCameras] = React.useState([]);
      const [selectedLighting, setSelectedLighting] = React.useState([]);
      const [selectedAmbientacao, setSelectedAmbientacao] = React.useState([]);
      const [selectedTons, setSelectedTons] = React.useState([]);
      const [selectedEstilosVocais, setSelectedEstilosVocais] = React.useState([]);
      const [selectedSotaques, setSelectedSotaques] = React.useState([]);
      const [numCenas, setNumCenas] = React.useState(0);
      const [activeTab, setActiveTab] = React.useState('generator');
      const [generatedPrompt, setGeneratedPrompt] = React.useState('');
      const [errorMessage, setErrorMessage] = React.useState('');
      const [successMessage, setSuccessMessage] = React.useState('');
      const [userCredits, setUserCredits] = React.useState(0);
      const [isGenerating, setIsGenerating] = React.useState(false);
      
      const fetchProfile = async () => {
        try {
            const { data, error, status } = await supabaseClient.from('profiles').select('credits').eq('id', session.user.id).single();

            if (error && status === 406) {
                console.warn('Perfil nÃ£o encontrado, a criar um novo para o utilizador.');
                const { data: newData, error: insertError } = await supabaseClient.from('profiles').insert({ id: session.user.id, username: session.user.user_metadata.nome, credits: 100 }).select('credits').single();

                if (insertError) {
                    throw insertError;
                }
                if (newData) setUserCredits(newData.credits);
            
            } else if (error) {
                throw error;
            
            } else if (data) {
                setUserCredits(data.credits);
            }
        } catch (error) {
            console.error('Erro detalhado ao carregar/criar perfil:', error);
            setErrorMessage('NÃ£o foi possÃ­vel carregar os seus dados de perfil. Por favor, atualize a pÃ¡gina.');
        }
      };
      
      React.useEffect(() => {
        if (session) fetchProfile();
      }, [session]);

      const estiloVisualOptions = ['CinemÃ¡tico', 'Fotorealista (8K)', 'Filme noir', 'Anime', 'Aquarela', 'Pintura a Ã³leo', 'Desenho animado 3D', 'Vintage', 'Cyberpunk', 'Steampunk', 'Minimalista', 'Surreal', 'DocumentÃ¡rio', 'Filmagem de drone', 'Time-lapse', 'Preto e branco'];
      const cameraOptions = ['Close-up extremo', 'Plano geral', 'Vista aÃ©rea', 'PanorÃ¢mica', 'CÃ¢mera na mÃ£o', 'Dolly zoom', 'CÃ¢mera lenta', 'CÃ¢mera rÃ¡pida', 'Plano mÃ©dio', 'Plano detalhe'];
      const lightingOptions = ['Luz natural', 'IluminaÃ§Ã£o dramÃ¡tica', 'Luz suave', 'Luz neon', 'PÃ´r do sol', 'CrepÃºsculo', 'Dia claro', 'Noite urbana', 'Luz de vela', 'Luz de estÃºdio', 'Contraluz'];
      const ambientacaoOptions = ['Misteriosa', 'Aconchegante', 'Ãpica', 'Sombria', 'NostÃ¡lgica', 'CaÃ³tica', 'Serena', 'Futurista', 'PÃ³s-apocalÃ­ptica', 'OnÃ­rica', 'MÃ¡gica', 'RomÃ¢ntica', 'MelancÃ³lica', 'Alegre'];
      const tonsDeVozOptions = ['Grave', 'Aguda', 'Suave', 'Rouca', 'Sussurrada', 'MelÃ³dica', 'MonÃ³tona', 'EnÃ©rgica', 'SÃ©ria'];
      const estilosVocaisOptions = ['NarraÃ§Ã£o', 'Trailer de Filme', 'Telejornal', 'Desenho Animado', 'RÃ¡dio', 'AnÃºncio', 'Contador de HistÃ³rias', 'Palestrante'];
      const sotaquesOptions = ['Brasileiro', 'PortuguÃªs', 'Americano', 'BritÃ¢nico', 'FrancÃªs', 'Espanhol', 'Italiano', 'JaponÃªs'];

      const handleMultiSelectChange = (e, setter) => setter(Array.from(e.target.selectedOptions, option => option.value));
      const handleNumCenasChange = (e) => setNumCenas(parseInt(e.target.value, 10));
      const calculateCost = (scenes) => 15 + (scenes > 0 ? (scenes * 5) : 0);

      const handleBuyCredits = async (amount) => {
        const newTotal = userCredits + amount;
        const { error } = await supabaseClient.from('profiles').update({ credits: newTotal }).eq('id', session.user.id);
        if (error) setErrorMessage('Erro ao adicionar crÃ©ditos.');
        else {
          setUserCredits(newTotal);
          setSuccessMessage(`${amount} crÃ©ditos adicionados com sucesso!`);
          setActiveTab('generator');
        }
      };

      const handleCopy = () => {
        if (generatedPrompt) {
          navigator.clipboard.writeText(generatedPrompt).then(() => {
            setSuccessMessage('Prompt copiado para a Ã¡rea de transferÃªncia!');
          }).catch(err => setErrorMessage('Falha ao copiar o prompt.'));
        }
      };

      const generateAIPrompt = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        setIsGenerating(true);
        
        try {
          const { data, error } = await supabaseClient.functions.invoke('generate-prompt-function', {
            body: { 
              sujeito, acao, cenario, selectedEstiloVisual, selectedCameras, selectedLighting,
              selectedAmbientacao, selectedTons, selectedEstilosVocais, selectedSotaques, numCenas
            },
          })

          if (error) throw error;
          
          setGeneratedPrompt(data.prompt);
          setSuccessMessage('Prompt gerado com IA com sucesso!');
          await fetchProfile();

        } catch (error) {
          const message = error.context?.json?.error || error.message || "NÃ£o foi possÃ­vel gerar o prompt. Tente novamente.";
          setErrorMessage(message);
        } finally {
          setIsGenerating(false);
        }
      };
      
      const getTabClass = (tabName) => `transition-all duration-300 px-4 py-3 font-semibold rounded-t-lg focus:outline-none ${activeTab === tabName ? 'bg-white text-purple-800 border-b-2 border-purple-800' : 'text-gray-500 hover:text-purple-700 hover:bg-gray-100'}`;

      return (
        <div className="flex flex-col h-screen text-gray-800 font-inter bg-gray-100">
          <header className="w-full px-6 lg:px-10 py-4 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
            <h1 className="text-2xl font-bold text-purple-900">Veo Creator Pro</h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={session.user.user_metadata?.nome || session.user.email}>
                        {session.user.user_metadata?.nome || 'Utilizador'}
                    </p>
                    <p className="text-xs text-gray-500 truncate" title={session.user.email}>
                        {session.user.email}
                    </p>
                </div>
                <div className="h-10 border-l border-gray-300"></div>
                <div className="text-sm text-purple-800 font-semibold">CrÃ©ditos: {userCredits}</div>
                <button onClick={() => supabaseClient.auth.signOut()} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Sair</button>
            </div>
          </header>
          
          <main className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-xl">
              <div className="flex border-b border-gray-200 mb-6">
                <button className={getTabClass('generator')} onClick={() => setActiveTab('generator')}>Gerador</button>
                <button className={getTabClass('pillars')} onClick={() => setActiveTab('pillars')}>Pilares e Dicas</button>
                <button className={getTabClass('credits')} onClick={() => setActiveTab('credits')}>CrÃ©ditos</button>
              </div>
              <div>
                {activeTab === 'generator' && (
                  <div>
                    {successMessage && (<div className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-lg">{successMessage}</div>)}
                    {errorMessage && (<div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{errorMessage}</div>)}
                    <div className="space-y-6">
                      <textarea id="sujeitoTextarea" className="w-full p-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 placeholder-gray-400 resize-y" value={sujeito} onChange={(e) => setSujeito(e.target.value)} rows="2" placeholder="O Sujeito (O QuÃª?): Ex: um fusca azul-bebÃª de 1970"></textarea>
                      <textarea id="cenarioTextarea" className="w-full p-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 placeholder-gray-400 resize-y" value={cenario} onChange={(e) => setCenario(e.target.value)} rows="2" placeholder="O CenÃ¡rio (Onde?): Ex: uma livraria antiga e empoeirada"></textarea>
                      <textarea id="acaoTextarea" className="w-full p-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 placeholder-gray-400 resize-y" value={acao} onChange={(e) => setAcao(e.target.value)} rows="2" placeholder="A AÃ§Ã£o (Fazendo o QuÃª?): Ex: correndo em cÃ¢mera lenta"></textarea>
                      <select id="numCenas" className="w-full p-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300" value={numCenas} onChange={handleNumCenasChange}>
                        {[...Array(11)].map((_, index) => (<option key={index} value={index}>{index} cena(s)</option>))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-2">
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">Estilo Visual:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedEstiloVisual} onChange={(e) => handleMultiSelectChange(e, setSelectedEstiloVisual)}>{estiloVisualOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">CÃ¢mera:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedCameras} onChange={(e) => handleMultiSelectChange(e, setSelectedCameras)}>{cameraOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">IluminaÃ§Ã£o:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedLighting} onChange={(e) => handleMultiSelectChange(e, setSelectedLighting)}>{lightingOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">AmbientaÃ§Ã£o:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedAmbientacao} onChange={(e) => handleMultiSelectChange(e, setSelectedAmbientacao)}>{ambientacaoOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">Tonalidade Voz:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedTons} onChange={(e) => handleMultiSelectChange(e, setSelectedTons)}>{tonsDeVozOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div><label className="block text-purple-800 text-lg font-semibold mb-2">Estilo Vocal:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedEstilosVocais} onChange={(e) => handleMultiSelectChange(e, setSelectedEstilosVocais)}>{estilosVocaisOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                        <div className="lg:col-span-1"><label className="block text-purple-800 text-lg font-semibold mb-2">Sotaque:</label><select multiple className="w-full p-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300 h-32" value={selectedSotaques} onChange={(e) => handleMultiSelectChange(e, setSelectedSotaques)}>{sotaquesOptions.map((o, i) => (<option key={i} value={o}>{o}</option>))}</select></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-6">(Use Ctrl/Cmd + clique para selecionar mÃºltiplas opÃ§Ãµes)</p>
                    <div className="text-center my-4 text-purple-700 text-md font-semibold">Custo para este prompt: <span className="font-bold">{calculateCost(numCenas)} crÃ©ditos</span></div>
                    <button onClick={generateAIPrompt} disabled={isGenerating} className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-purple-400">
                      {isGenerating ? 'A gerar com IA...' : 'Gerar Prompt'}
                    </button>
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-3"><h3 className="text-xl font-semibold text-purple-900">Prompt Gerado:</h3><button onClick={handleCopy} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-purple-300 transition">Copiar</button></div>
                      <textarea readOnly className="w-full h-36 p-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" value={generatedPrompt} placeholder="Seu prompt gerado pela IA aparecerÃ¡ aqui..."></textarea>
                    </div>
                  </div>
                )}
                {activeTab === 'pillars' && ( <div className="text-gray-700 p-2 space-y-8"> <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-purple-900">ð Os Pilares de um Prompt Perfeito</h2> <ul className="space-y-5 text-base leading-relaxed"> <li><strong className="text-purple-800">Sujeito (O QuÃª?):</strong> Seja ultra especÃ­fico. <em className="italic">"Um fusca azul-bebÃª de 1970."</em></li> <li><strong className="text-purple-800">CenÃ¡rio (Onde?):</strong> Construa o mundo. <em className="italic">"Em uma livraria antiga e empoeirada."</em></li> <li><strong className="text-purple-800">AÃ§Ã£o (Fazendo o QuÃª?):</strong> Descreva o movimento. <em className="italic">"Correndo em cÃ¢mera lenta."</em></li> <li><strong className="text-purple-800">Estilo Visual (Como?):</strong> Defina a "lente" do vÃ­deo. <em className="italic">"CinemÃ¡tico, fotorealista, 8K."</em></li> <li><strong className="text-purple-800">CÃ¢mera e ComposiÃ§Ã£o:</strong> Dirija a cena. <em className="italic">"Vista aÃ©rea, plano geral."</em></li> <li><strong className="text-purple-800">Ãudio (Voz e Som):</strong> Defina a paisagem sonora. <em className="italic">"Voz grave, estilo de narraÃ§Ã£o com sotaque britÃ¢nico."</em></li> </ul> <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-4 text-purple-900">â¨ Dica de Ouro: Combinando Elementos</h2> <blockquote className="bg-gray-50 rounded-lg p-4 italic border-l-4 border-purple-700 text-gray-700"> <span className="font-semibold text-purple-800">Exemplo:</span> Plano geral cinemÃ¡tico de um astronauta solitÃ¡rio saltando em gravidade zero na superfÃ­cie de Marte, com 2 cenas, narraÃ§Ã£o com voz suave e calma. </blockquote> <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-4 text-purple-900">ð« O que Evitar</h2> <ul className="list-disc list-inside space-y-3 text-base"> <li>Pedidos vagos: "faÃ§a um vÃ­deo legal".</li> <li>ContradiÃ§Ãµes: "um carro voador submerso".</li> <li>Excesso de elementos: Foque no principal.</li> </ul> </div>)}
                {activeTab === 'credits' && (<div className="p-4"><h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-purple-900">Comprar CrÃ©ditos</h2><div className="bg-purple-50 border-l-4 border-purple-500 text-purple-800 p-4 mb-8 rounded-r-lg"><p className="font-bold">Como funciona:</p><ul className="list-disc list-inside mt-2"><li>Custo base por prompt: <strong>15 crÃ©ditos</strong>.</li><li>Custo adicional por cena: <strong>5 crÃ©ditos</strong>.</li></ul></div><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">{[20, 30, 40, 50, 60, 70, 80].map((credits) => (<div key={credits} className="relative overflow-hidden bg-white rounded-xl shadow-md p-5 border border-purple-100 text-center flex flex-col justify-between hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"><div className="absolute top-2 -right-11"><div className="bg-purple-700 text-white text-xs font-bold uppercase tracking-wider text-center transform rotate-45 py-1 px-10">Promo</div></div><div><h3 className="text-lg font-bold text-purple-800 mb-2 mt-2">{credits} CrÃ©ditos</h3><p className="text-2xl font-bold text-gray-900 mb-4">R$ {(credits * 0.3998).toFixed(2)}</p></div><button onClick={() => handleBuyCredits(credits)} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-2">Comprar</button></div>))}</div><p className="mt-8 text-center text-gray-500 text-sm">* A compra e o uso de crÃ©ditos sÃ£o simulados. Nenhuma transaÃ§Ã£o real serÃ¡ efetuada.</p></div>)}
              </div>
            </div>
          </main>
        </div>
      );
    }
    
    // --- COMPONENTE RAIZ QUE GERE O ESTADO DE AUTENTICAÃÃO ---
    function App() {
        const [session, setSession] = React.useState(null);
        const [authView, setAuthView] = React.useState('login'); 

        React.useEffect(() => {
          supabaseClient.auth.getSession().then(({ data: { session } }) => setSession(session));
          const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => setSession(session));
          return () => subscription.unsubscribe();
        }, []);

        if (session) return <MainApp session={session} />;
        
        return <AuthForm isRegistering={authView === 'register'} onShowLogin={() => setAuthView('login')} onShowRegister={() => setAuthView('register')} />;
    }

    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  </script>
</body>
</html>
